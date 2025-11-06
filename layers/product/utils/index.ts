import type { Product } from '~/graphql';

export const mountUrlSlugForProductVariant = (product: Product): string => {
  const params =
    product?.variantAttributeValues
      ?.map((variantAttributeValue) => `${variantAttributeValue?.attribute?.name}=${variantAttributeValue?.id}&`)
      ?.join('') || '';

  const joinedSlug = `${product?.slug || ''}?${params}`;
  return joinedSlug.slice(0, -1);
};

export function useNextDeliveryDateUK(leadTimeDays = 0) {
  return computed(() => {
    const now = new Date()

    // Get current UK time
    const ukTime = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      hour12: false,
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).formatToParts(now)

    const hour = parseInt(ukTime.find(p => p.type === 'hour').value, 10)
    const minute = parseInt(ukTime.find(p => p.type === 'minute').value, 10)
    const weekday = ukTime.find(p => p.type === 'weekday').value

    const inWindow = (hour > 9 || (hour === 9 && minute >= 0)) &&
      (hour < 15 || (hour === 15 && minute <= 30))

    const resultDate = new Date()

    if (inWindow) {
      if (weekday === 'Fri') {
        // Friday in window → Monday
        const daysUntilMonday = (8 - resultDate.getDay()) % 7 || 7
        resultDate.setDate(resultDate.getDate() + daysUntilMonday)
      } else {
        // Other weekdays → Tomorrow
        resultDate.setDate(resultDate.getDate() + 1)
      }
    } else {
      if (weekday === 'Thu') {
        // Thursday after 15:30 → Monday
        const daysUntilMonday = (8 - resultDate.getDay()) % 7 || 7
        resultDate.setDate(resultDate.getDate() + daysUntilMonday)
      } else if (weekday === 'Fri') {
        // Friday after 15:30 → Tuesday
        const daysUntilTuesday = (9 - resultDate.getDay()) % 7 || 7
        resultDate.setDate(resultDate.getDate() + daysUntilTuesday)
      } else {
        // Other weekdays → Day after tomorrow
        resultDate.setDate(resultDate.getDate() + 2)
      }
    }

    // Add extra lead time
    if (leadTimeDays > 0) {
      resultDate.setDate(resultDate.getDate() + leadTimeDays)
    }

    // Format as "Fri Nov 07"
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      weekday: 'short',
      month: 'short',
      day: '2-digit'
    }).format(resultDate)
  })
}

export function useClickAndCollectTime(leadTimeDays = 0) {
  const now = new Date()

  if (leadTimeDays > 0) {
    const resultDate = new Date(now)
    resultDate.setDate(resultDate.getDate() + leadTimeDays)

    // Format like: "Estimated Wed Nov 12 5pm"
    const formatted = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      weekday: 'short',
      month: 'short',
      day: '2-digit'
    }).format(resultDate)

    return `Estimated ${formatted} before 5pm`
  }

  // Get UK time info
  const ukParts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short'
  }).formatToParts(now)

  const hour = parseInt(ukParts.find(p => p.type === 'hour').value, 10)
  const minute = parseInt(ukParts.find(p => p.type === 'minute').value, 10)
  const weekday = ukParts.find(p => p.type === 'weekday').value

  const day = now.toLocaleString('en-GB', { timeZone: 'Europe/London', weekday: 'short' })
  const isWeekend = (day === 'Sat' || day === 'Sun')

  // Weekend → Monday 8:30am
  if (isWeekend) return 'Monday at 9:30am'

  // Within 08:30–15:30 → "In 1 hour"
  const inWindow =
    (hour > 8 || (hour === 8 && minute >= 30)) &&
    (hour < 15 || (hour === 15 && minute <= 30))
  if (inWindow) return 'Today In 1 hour'

  // Before 08:30 → "9:30am"
  if (hour < 8 || (hour === 8 && minute < 30)) return 'Today at 9:30am'

  // After 15:30
  if (hour > 15 || (hour === 15 && minute > 30)) {
    // Friday → Monday 8:30am
    if (weekday === 'Fri') return 'Monday at 9:30am'
    // Otherwise → Tomorrow 8:30am
    return 'Tomorrow at 9:30am'
  }

  // Fallback
  return 'Unavailable'
}
