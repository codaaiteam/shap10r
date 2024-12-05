// lib/gtag.js
export const GA_ID = 'G-5Q3KHWXNED'

export const pageview = (url) => {
  window.gtag('config', GA_ID, {
    page_path: url,
  })
}

export const event = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}