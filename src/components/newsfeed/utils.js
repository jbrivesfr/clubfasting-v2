// Utils for newsfeed components

/**
 * Convert a date string to a human-readable "time ago" format
 */
export function timeAgo(dateString) {
  if (!dateString) return ''

  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffWeek = Math.floor(diffDay / 7)
  const diffMonth = Math.floor(diffDay / 30)
  const diffYear = Math.floor(diffDay / 365)

  if (diffSec < 60) {
    return 'à l\'instant'
  } else if (diffMin < 60) {
    return `il y a ${diffMin} min`
  } else if (diffHour < 24) {
    return `il y a ${diffHour}h`
  } else if (diffDay === 1) {
    return 'hier'
  } else if (diffDay < 7) {
    return `il y a ${diffDay}j`
  } else if (diffWeek < 4) {
    return `il y a ${diffWeek}sem`
  } else if (diffMonth < 12) {
    return `il y a ${diffMonth}mois`
  } else {
    return `il y a ${diffYear}an${diffYear > 1 ? 's' : ''}`
  }
}

/**
 * Format a journey message with links converted to buttons, <b> tags, and line breaks
 */
export function formatJourneyMessageJS(message) {
  if (!message) return ''

  let formatted = escape(message)

  // Convert [text](url) to clickable buttons
  formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-sm text-orange-300 hover:text-orange-200 transition-all font-medium no-underline">${text}<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>`
  })

  // Convert remaining (url) patterns
  formatted = formatted.replace(/\((https?:\/\/[^)]+)\)/g, (_, url) => {
    const displayUrl = url.length > 40 ? url.substring(0, 37) + '...' : url
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-orange-400 hover:text-orange-300 underline underline-offset-2">${displayUrl}</a>`
  })

  // Convert line breaks to <br>
  formatted = formatted.replace(/\n/g, '<br>')

  return formatted
}

/**
 * Basic HTML escaping
 */
export function escape(str) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Get default avatar URL using Picsum
 */
export function getDefaultAvatarUrl(seed, size = 40) {
  if (!seed) seed = 'default'
  const hash = md5(seed)
  return `https://picsum.photos/seed/${hash}/${size}/${size}`
}

/**
 * Simple MD5 hash for avatar seed
 */
function md5(str) {
  function safeAdd(x, y) {
    const lsw = (x & 0xffff) + (y & 0xffff)
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xffff)
  }
  function bitRotateLeft(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
  }
  function md5cmn(q, a, b, x, s, t) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
  }
  function md5ff(a, b, c, d, x, s, t) {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t)
  }
  function md5gg(a, b, c, d, x, s, t) {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t)
  }
  function md5hh(a, b, c, d, x, s, t) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t)
  }
  function md5ii(a, b, c, d, x, s, t) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t)
  }
  function binlMD5(x, len) {
    x[len >> 5] |= 0x80 << (len % 32)
    x[(((len + 64) >>> 9) << 4) + 14] = len
    let a = 1732584193
    let b = -271733879
    let c = -1732584194
    let d = 271733878
    for (let i = 0; i < x.length; i += 16) {
      const olda = a
      const oldb = b
      const oldc = c
      const oldd = d
      a = md5ff(a, b, c, d, x[i], 7, -680876936)
      d = md5ff(d, a, b, c, x[i + 1], 12, -389564586)
      c = md5ff(c, d, a, b, x[i + 2], 17, 606105819)
      b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330)
      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897)
      d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426)
      c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341)
      b = md5ff(b, c, d, a, x[i + 7], 22, -45705983)
      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416)
      d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417)
      c = md5ff(c, d, a, b, x[i + 10], 17, -42063)
      b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162)
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682)
      d = md5ff(d, a, b, c, x[i + 13], 12, -40341101)
      c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290)
      b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329)
      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510)
      d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632)
      c = md5gg(c, d, a, b, x[i + 11], 14, 643717713)
      b = md5gg(b, c, d, a, x[i], 20, -373897302)
      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691)
      d = md5gg(d, a, b, c, x[i + 10], 9, 38016083)
      c = md5gg(c, d, a, b, x[i + 15], 14, -660478335)
      b = md5gg(b, c, d, a, x[i + 4], 20, -405537848)
      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438)
      d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690)
      c = md5gg(c, d, a, b, x[i + 3], 14, -187363961)
      b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501)
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467)
      d = md5gg(d, a, b, c, x[i + 2], 9, -51403784)
      c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473)
      b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734)
      a = md5hh(a, b, c, d, x[i + 5], 4, -378558)
      d = md5hh(d, a, b, c, x[i + 8], 11, -2022574513)
      c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562)
      b = md5hh(b, c, d, a, x[i + 14], 23, -35309556)
      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060)
      d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353)
      c = md5hh(c, d, a, b, x[i + 7], 16, -155497632)
      b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640)
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174)
      d = md5hh(d, a, b, c, x[i + 0], 11, -358537222)
      c = md5hh(c, d, a, b, x[i + 3], 16, -722521979)
      b = md5hh(b, c, d, a, x[i + 6], 23, 76029189)
      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487)
      d = md5hh(d, a, b, c, x[i + 12], 11, -421815835)
      c = md5hh(c, d, a, b, x[i + 15], 16, 530742520)
      b = md5hh(b, c, d, a, x[i + 2], 23, -995338651)
      a = md5ii(a, b, c, d, x[i], 6, -198630844)
      d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415)
      c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905)
      b = md5ii(b, c, d, a, x[i + 5], 21, -57434055)
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571)
      d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606)
      c = md5ii(c, d, a, b, x[i + 10], 15, -1051523)
      b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799)
      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359)
      d = md5ii(d, a, b, c, x[i + 15], 10, -30611744)
      c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380)
      b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649)
      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070)
      d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379)
      c = md5ii(c, d, a, b, x[i + 2], 15, 718787259)
      b = md5ii(b, c, d, a, x[i + 9], 21, -343485551)
      a = safeAdd(a, olda)
      b = safeAdd(b, oldb)
      c = safeAdd(c, oldc)
      d = safeAdd(d, oldd)
    }
    return [a, b, c, d]
  }
  function binl2hex(binarray) {
    const hexTab = '0123456789abcdef'
    let str = ''
    for (let i = 0; i < binarray.length * 4; i++) {
      str += hexTab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xf) + hexTab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xf)
    }
    return str
  }
  function rstrMD5(s) {
    const bin = []
    for (let i = 0; i < s.length * 8; i += 8) {
      bin[i >> 5] |= (s.charCodeAt(i / 8) & 0xff) << (i % 32)
    }
    return binlMD5(bin, s.length * 8)
  }
  return binl2hex(rstrMD5(str)).toLowerCase()
}

/**
 * Validate UUID format
 */
export function isValidUUID(str) {
  if (!str || typeof str !== 'string') return false
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

/**
 * Count all replies recursively
 */
export function countAllRepliesRecursive(comment) {
  if (!comment || !comment.replies || comment.replies.length === 0) {
    return 0
  }
  let count = comment.replies.length
  for (const reply of comment.replies) {
    count += countAllRepliesRecursive(reply)
  }
  return count
}

/**
 * Build nested replies structure from flat array
 */
export function buildRepliesTree(comments) {
  const commentMap = {}
  const roots = []

  // First pass: create map
  comments.forEach(comment => {
    commentMap[comment.id] = { ...comment, replies: [] }
  })

  // Second pass: build tree
  comments.forEach(comment => {
    if (comment.parent_id && commentMap[comment.parent_id]) {
      commentMap[comment.parent_id].replies.push(commentMap[comment.id])
    } else {
      roots.push(commentMap[comment.id])
    }
  })

  return roots
}

/**
 * Get likers for a comment as an array of names
 */
export function getLikersNames(comment) {
  if (!comment.likers || comment.likers === '') return []
  return comment.likers.split(',').map(l => l.trim()).filter(Boolean)
}

/**
 * Get reply authors as avatar list (top 3)
 */
export function getReplyAuthors(comment) {
  if (!comment.replies || comment.replies.length === 0) return []
  const authors = []
  const seen = new Set()
  
  for (const reply of comment.replies) {
    if (!seen.has(reply.author_id)) {
      seen.add(reply.author_id)
      authors.push({
        id: reply.author_id,
        name: reply.author_name,
        avatar: reply.author_avatar
      })
      if (authors.length >= 3) break
    }
  }
  
  return authors
}