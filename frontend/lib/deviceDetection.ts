// 设备检测工具

// 检测是否为移动设备
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  const userAgent = navigator.userAgent.toLowerCase()
  
  // 检测移动设备
  const mobileKeywords = [
    'android',
    'iphone',
    'ipad',
    'ipod',
    'blackberry',
    'windows phone',
    'mobile',
    'tablet'
  ]
  
  const isMobile = mobileKeywords.some(keyword => userAgent.includes(keyword))
  
  // 检测屏幕尺寸
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  
  // 如果屏幕宽度小于 768px，也认为是移动设备
  const isSmallScreen = screenWidth < 768
  
  return isMobile || isSmallScreen
}

// 检测是否为平板设备
export function isTabletDevice(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  const userAgent = navigator.userAgent.toLowerCase()
  
  // 检测平板设备
  const tabletKeywords = [
    'ipad',
    'tablet',
    'android.*mobile.*tablet',
    'tablet.*android'
  ]
  
  const isTablet = tabletKeywords.some(keyword => 
    new RegExp(keyword, 'i').test(userAgent)
  )
  
  // 检测屏幕尺寸（平板通常介于 768px 和 1024px 之间）
  const screenWidth = window.innerWidth
  const isTabletScreen = screenWidth >= 768 && screenWidth <= 1024
  
  return isTablet || isTabletScreen
}

// 检测是否为桌面设备
export function isDesktopDevice(): boolean {
  return !isMobileDevice() && !isTabletDevice()
}

// 获取设备类型
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (isMobileDevice()) {
    return 'mobile'
  } else if (isTabletDevice()) {
    return 'tablet'
  } else {
    return 'desktop'
  }
}

// 检测屏幕方向
export function getScreenOrientation(): 'portrait' | 'landscape' {
  if (typeof window === 'undefined') {
    return 'landscape'
  }
  
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
}

// 检测是否为触摸设备
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// 获取屏幕尺寸信息
export function getScreenInfo() {
  if (typeof window === 'undefined') {
    return {
      width: 0,
      height: 0,
      ratio: 1,
      isRetina: false
    }
  }
  
  const width = window.innerWidth
  const height = window.innerHeight
  const ratio = window.devicePixelRatio || 1
  const isRetina = ratio > 1
  
  return {
    width,
    height,
    ratio,
    isRetina
  }
}

// 监听屏幕尺寸变化
export function onScreenResize(callback: (info: ReturnType<typeof getScreenInfo>) => void) {
  if (typeof window === 'undefined') {
    return () => {}
  }
  
  const handleResize = () => {
    callback(getScreenInfo())
  }
  
  window.addEventListener('resize', handleResize)
  
  // 返回清理函数
  return () => {
    window.removeEventListener('resize', handleResize)
  }
}

// 检测是否为 Safari 浏览器
export function isSafari(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  
  const userAgent = navigator.userAgent.toLowerCase()
  return userAgent.includes('safari') && !userAgent.includes('chrome')
}

// 检测是否为 iOS 设备
export function isIOS(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  
  const userAgent = navigator.userAgent.toLowerCase()
  return /iphone|ipad|ipod/.test(userAgent)
}

// 检测是否为 Android 设备
export function isAndroid(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  
  const userAgent = navigator.userAgent.toLowerCase()
  return userAgent.includes('android')
} 