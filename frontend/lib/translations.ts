import zhMessages from '../messages/zh.json'
import jaMessages from '../messages/ja.json'
import enMessages from '../messages/en.json'

const messages = {
  zh: zhMessages,
  ja: jaMessages,
  en: enMessages,
}

export function getTranslation(language: 'zh' | 'ja' | 'en', key: string): string {
  const keys = key.split('.')
  let value: any = messages[language]
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      // 如果找不到翻译，返回中文作为后备
      value = getFallbackTranslation(key)
      break
    }
  }
  
  let result = typeof value === 'string' ? value : key
  
  // 替换动态年份
  if (result.includes('{year}')) {
    const currentYear = new Date().getFullYear()
    result = result.replace('{year}', currentYear.toString())
  }
  
  return result
}

function getFallbackTranslation(key: string): string {
  const keys = key.split('.')
  let value: any = messages.zh
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return key
    }
  }
  
  let result = typeof value === 'string' ? value : key
  
  // 替换动态年份
  if (result.includes('{year}')) {
    const currentYear = new Date().getFullYear()
    result = result.replace('{year}', currentYear.toString())
  }
  
  return result
}

export function t(language: 'zh' | 'ja' | 'en', key: string): string {
  return getTranslation(language, key)
} 