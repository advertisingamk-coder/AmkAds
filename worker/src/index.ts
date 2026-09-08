import { Hono } from 'hono'
import { SignJWT, jwtVerify } from 'jose'
import { Resend } from 'resend'

type Bindings = {
  DB: D1Database
  MEDIA_BUCKET: R2Bucket
  ADMIN_USERNAME?: string
  ADMIN_PASSWORD?: string
  JWT_SECRET?: string
  ENVIRONMENT?: string
  RESEND_API_KEY?: string
  CONTACT_RECEIVER_EMAIL?: string
  // Comma-separated list of allowed origins for the admin panel
  // e.g. "https://admin.amkadvertising.com,https://amkads-admin.pages.dev"
  ADMIN_ORIGIN?: string
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS Middleware
// Reads allowed origins from the ADMIN_ORIGIN env var (set in Cloudflare dashboard).
// Falls back to a permissive wildcard for local dev when env var is absent.
app.use('*', async (c, next) => {
  const origin = c.req.header('Origin') || ''
  const allowedOriginsRaw = c.env.ADMIN_ORIGIN || ''
  const allowedOrigins = allowedOriginsRaw
    ? allowedOriginsRaw.split(',').map(o => o.trim())
    : []

  // Determine which origin to echo back (or '*' for dev)
  const effectiveOrigin =
    allowedOrigins.length === 0
      ? (origin || '*')
      : (allowedOrigins.includes(origin) ? origin : allowedOrigins[0])

  c.header('Access-Control-Allow-Origin', effectiveOrigin)
  c.header('Access-Control-Allow-Credentials', 'true')
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (c.req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: c.res.headers })
  }
  await next()
})

// Authentication Middleware
const authMiddleware = async (c: any, next: any) => {
  const cookieString = c.req.header('Cookie') || ''
  const match = cookieString.match(/(?:^|;\s*)admin_session=([^;]*)/)
  const token = match ? match[1] : null

  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  try {
    const secret = new TextEncoder().encode(c.env.JWT_SECRET || 'fallback_secret_key')
    await jwtVerify(token, secret)
    await next()
  } catch (error) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
}

// ----------------------------------------------------------------------------
// PUBLIC ROUTES
// ----------------------------------------------------------------------------

// Contact Form
app.post('/api/contact', async (c) => {
  try {
    const body = await c.req.json()
    const { name, email, company, service, message } = body

    const receiverEmail = c.env.CONTACT_RECEIVER_EMAIL || 'advertisingamk@gmail.com'

    const htmlBody = `
      <h2>New Website Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company/Brand:</strong> ${company || 'N/A'}</p>
      <p><strong>Service Requested:</strong> ${service}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="background: #f4f4f4; padding: 10px; border-left: 4px solid #3b82f6;">
        ${message}
      </blockquote>
    `

    if (c.env.RESEND_API_KEY) {
      const apiKey = c.env.RESEND_API_KEY.trim()
      const resend = new Resend(apiKey)
      
      const { data, error } = await resend.emails.send({
        from: 'AMK Ads <onboarding@resend.dev>',
        to: [receiverEmail],
        replyTo: email,
        subject: `New Lead: ${name} (${company || 'General Inquiry'})`,
        html: htmlBody,
      })

      if (error) {
        return c.json({ success: false, error }, 400)
      }
      
      return c.json({ success: true, data }, 200)
    } else {
      return c.json({ success: false, error: "Server Configuration Error: Missing API Key" }, 500)
    }
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Login
app.post('/api/admin/login', async (c) => {
  try {
    const { username, password } = await c.req.json()
    const validUsername = c.env.ADMIN_USERNAME
    const validPassword = c.env.ADMIN_PASSWORD

    if (!validUsername || !validPassword) {
      return c.json({ error: 'Server configuration error' }, 500)
    }

    if (username === validUsername && password === validPassword) {
      const secret = new TextEncoder().encode(c.env.JWT_SECRET || 'fallback_secret_key')
      
      const token = await new SignJWT({ role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secret)

      c.header('Set-Cookie', `admin_session=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=None; Secure`)
      return c.json({ success: true }, 200)
    }
    return c.json({ error: 'Invalid credentials' }, 401)
  } catch (error) {
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Logout
app.post('/api/admin/logout', async (c) => {
  c.header('Set-Cookie', 'admin_session=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure')
  return c.json({ success: true })
})

// Session check — used by the standalone Admin Panel's ProtectedRoute component.
// The client calls this with credentials:'include'; if the HttpOnly cookie is valid
// the worker returns 200, otherwise 401, never exposing the JWT to JS.
app.get('/api/admin/me', authMiddleware, async (c) => {
  return c.json({ authenticated: true })
})

// Get Portfolio
app.get('/api/portfolio', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM PortfolioMedia ORDER BY displayOrder DESC, created_at DESC"
    ).all()
    return c.json(results)
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

// Get Service Videos
app.get('/api/service-videos', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT service_slug, video_url FROM service_videos').all()
    const mapping: Record<string, string> = {}
    for (const row of results) {
      mapping[row.service_slug as string] = row.video_url as string
    }
    return c.json(mapping)
  } catch (err: any) {
    if (err.message && err.message.includes('no such table')) {
      return c.json({})
    }
    return c.json({ error: 'Failed to fetch videos' }, 500)
  }
})

// Get Division Media (Public)
app.get('/api/division-media/:slug', async (c) => {
  const slug = c.req.param('slug')
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM division_media WHERE division_slug = ? ORDER BY sort_order ASC, uploaded_at DESC'
    ).bind(slug).all()
    return c.json(results)
  } catch (err: any) {
    if (err.message && err.message.includes('no such table')) return c.json([])
    return c.json({ error: 'Failed to fetch division media' }, 500)
  }
})

// Serve Media (R2)
app.get('/media/*', async (c) => {
  const url = new URL(c.req.url)
  let path = url.pathname.replace('/media/', '')
  
  if (!path) {
    return c.text('Not found', 404)
  }

  const object = await c.env.MEDIA_BUCKET.get(path)
  if (!object) {
    return c.text('Not found', 404)
  }

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)

  return new Response(object.body as any, {
    headers,
  })
})

// ----------------------------------------------------------------------------
// PROTECTED ROUTES
// ----------------------------------------------------------------------------
app.use('/api/portfolio', authMiddleware)
app.use('/api/portfolio/*', authMiddleware)
app.use('/api/admin/service-videos/*', authMiddleware)
app.use('/api/admin/division-media/*', authMiddleware)

// Create Portfolio Item
app.post('/api/portfolio', async (c) => {
  try {
    const formData = await c.req.formData()
    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const brand = formData.get('brand') as string
    const type = formData.get('type') as string
    const description = formData.get('description') as string
    const location = formData.get('location') as string
    const imageSrc = formData.get('imageSrc') as string
    const altText = formData.get('altText') as string
    const displayOrder = parseInt(formData.get('displayOrder') as string) || 0
    const isFeatured = formData.get('isFeatured') === 'true' ? 1 : 0

    if (!id || !title || !brand || !type || !description || !imageSrc) {
       return c.json({ error: "Missing required fields" }, 400)
    }

    await c.env.DB.prepare(
      "INSERT INTO PortfolioMedia (id, title, brand, type, imageSrc, description, location, altText, displayOrder, isFeatured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(id, title, brand, type, imageSrc, description, location || null, altText || null, displayOrder, isFeatured).run()

    return c.json({ success: true, id, imageSrc })
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

// Update Portfolio Item
app.put('/api/portfolio/:id', async (c) => {
  const id = c.req.param('id')
  try {
    const formData = await c.req.formData()
    const title = formData.get('title') as string
    const brand = formData.get('brand') as string
    const type = formData.get('type') as string
    const description = formData.get('description') as string
    const location = formData.get('location') as string
    const imageSrc = formData.get('imageSrc') as string
    const altText = formData.get('altText') as string
    const displayOrder = parseInt(formData.get('displayOrder') as string) || 0
    const isFeatured = formData.get('isFeatured') === 'true' ? 1 : 0

    if (!title || !brand || !type || !description) {
      return c.json({ error: "Missing required fields" }, 400)
    }

    if (imageSrc) {
      await c.env.DB.prepare(
        "UPDATE PortfolioMedia SET title = ?, brand = ?, type = ?, imageSrc = ?, description = ?, location = ?, altText = ?, displayOrder = ?, isFeatured = ? WHERE id = ?"
      ).bind(title, brand, type, imageSrc, description, location || null, altText || null, displayOrder, isFeatured, id).run()
    } else {
      await c.env.DB.prepare(
        "UPDATE PortfolioMedia SET title = ?, brand = ?, type = ?, description = ?, location = ?, altText = ?, displayOrder = ?, isFeatured = ? WHERE id = ?"
      ).bind(title, brand, type, description, location || null, altText || null, displayOrder, isFeatured, id).run()
    }

    return c.json({ success: true, id })
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

// Delete Portfolio Item
app.delete('/api/portfolio/:id', async (c) => {
  const id = c.req.param('id')
  try {
    await c.env.DB.prepare("DELETE FROM PortfolioMedia WHERE id = ?").bind(id).run()
    return c.json({ success: true })
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

// Upload Service Video
app.post('/api/admin/service-videos/:slug', async (c) => {
  const slug = c.req.param('slug')
  try {
    const formData = await c.req.formData()
    const file = formData.get('file') as File

    if (!file || !file.type.startsWith('video/')) {
      return c.json({ error: 'Invalid file' }, 400)
    }

    const timestamp = Date.now()
    const extension = file.name.split('.').pop() || 'mp4'
    const videoKey = `service-videos/${slug}-${timestamp}.${extension}`

    await c.env.MEDIA_BUCKET.put(videoKey, file.stream(), {
      httpMetadata: { contentType: file.type },
    })

    const baseUrl = 'https://backend.pirailshostings.workers.dev' // Wait, what is the worker domain going to be? 
    // Usually it's better to return a relative URL or determine from request, but we will use the worker's domain.
    // Actually, we can use c.req.url to get the origin!
    const origin = new URL(c.req.url).origin
    const videoUrl = `${origin}/media/${videoKey}`

    const existing = await c.env.DB.prepare('SELECT video_key FROM service_videos WHERE service_slug = ?').bind(slug).first<{video_key: string}>()
    if (existing && existing.video_key) {
      await c.env.MEDIA_BUCKET.delete(existing.video_key)
    }

    const now = new Date().toISOString()
    await c.env.DB.prepare(`
      INSERT INTO service_videos (service_slug, video_key, video_url, uploaded_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(service_slug) DO UPDATE SET
        video_key = excluded.video_key,
        video_url = excluded.video_url,
        uploaded_at = excluded.uploaded_at
    `).bind(slug, videoKey, videoUrl, now).run()

    return c.json({ success: true, videoUrl })
  } catch (error: any) {
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Delete Service Video
app.delete('/api/admin/service-videos/:slug', async (c) => {
  const slug = c.req.param('slug')
  try {
    const existing = await c.env.DB.prepare('SELECT video_key FROM service_videos WHERE service_slug = ?').bind(slug).first<{video_key: string}>()
    
    if (existing && existing.video_key) {
      await c.env.MEDIA_BUCKET.delete(existing.video_key)
    }

    await c.env.DB.prepare('DELETE FROM service_videos WHERE service_slug = ?').bind(slug).run()
    return c.json({ success: true })
  } catch (error: any) {
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Upload Division Media
app.post('/api/admin/division-media/:slug', async (c) => {
  const slug = c.req.param('slug')
  try {
    const formData = await c.req.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string || ''

    if (!file) {
      return c.json({ error: 'No file uploaded' }, 400)
    }

    const type = file.type.startsWith('video/') ? 'video' : file.type.startsWith('image/') ? 'image' : null
    if (!type) {
      return c.json({ error: 'Invalid file type. Only images and videos are allowed.' }, 400)
    }

    const timestamp = Date.now()
    const extension = file.name.split('.').pop() || (type === 'video' ? 'mp4' : 'jpg')
    const mediaKey = `division-media/${slug}/${timestamp}.${extension}`

    await c.env.MEDIA_BUCKET.put(mediaKey, file.stream(), {
      httpMetadata: { contentType: file.type },
    })

    const origin = new URL(c.req.url).origin
    const mediaUrl = `${origin}/media/${mediaKey}`
    const now = new Date().toISOString()

    // Get max sort order
    const maxSort = await c.env.DB.prepare('SELECT MAX(sort_order) as maxSort FROM division_media WHERE division_slug = ?').bind(slug).first<{maxSort: number}>()
    const nextSort = (maxSort?.maxSort ?? -1) + 1

    const result = await c.env.DB.prepare(`
      INSERT INTO division_media (division_slug, media_type, media_key, media_url, title, sort_order, uploaded_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      RETURNING id
    `).bind(slug, type, mediaKey, mediaUrl, title, nextSort, now).first<{id: number}>()

    return c.json({ success: true, id: result?.id, mediaUrl })
  } catch (error: any) {
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Delete Division Media
app.delete('/api/admin/division-media/:id', async (c) => {
  const id = c.req.param('id')
  try {
    const existing = await c.env.DB.prepare('SELECT media_key FROM division_media WHERE id = ?').bind(id).first<{media_key: string}>()
    
    if (existing && existing.media_key) {
      await c.env.MEDIA_BUCKET.delete(existing.media_key)
    }

    await c.env.DB.prepare('DELETE FROM division_media WHERE id = ?').bind(id).run()
    return c.json({ success: true })
  } catch (error: any) {
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export default app
