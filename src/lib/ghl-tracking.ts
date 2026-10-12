let loading: Promise<void> | undefined

/** Load once, including React Strict Mode remounts. No CRM credentials are needed. */
export function loadGhlTracking() {
  return loading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://link.msgsndr.com/js/external-tracking.js'
    script.dataset.trackingId = 'tk_910733ebcf8e4f08bdec2c354c820f7c'
    script.async = true
    const timeout = window.setTimeout(() => reject(new Error('Tracking unavailable')), 15000)
    script.onload = () => { window.clearTimeout(timeout); resolve() }
    script.onerror = () => { window.clearTimeout(timeout); reject(new Error('Tracking unavailable')) }
    document.body.appendChild(script)
  })
}
