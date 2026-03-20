'use client'

import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY_PREFIX = 'toolDo_notifications_read'
const MAX_STORED_IDS = 200

function getStorageKey(userId: string | undefined, companyId: string | null | undefined) {
  if (!userId || !companyId) return null
  return `${STORAGE_KEY_PREFIX}_${userId}_${companyId}`
}

function loadReadIds(userId: string | undefined, companyId: string | null | undefined): Set<string> {
  const key = getStorageKey(userId, companyId)
  if (!key || typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return new Set()
    const arr = JSON.parse(raw) as string[]
    return new Set(Array.isArray(arr) ? arr.slice(-MAX_STORED_IDS) : [])
  } catch {
    return new Set()
  }
}

function saveReadIds(userId: string | undefined, companyId: string | null | undefined, ids: Set<string>) {
  const key = getStorageKey(userId, companyId)
  if (!key || typeof window === 'undefined') return
  try {
    const arr = Array.from(ids).slice(-MAX_STORED_IDS)
    localStorage.setItem(key, JSON.stringify(arr))
  } catch {
    // ignore
  }
}

export function useReadNotificationIds(
  userId: string | undefined,
  companyId: string | null | undefined
) {
  const [readIds, setReadIds] = useState<Set<string>>(() =>
    loadReadIds(userId, companyId)
  )

  useEffect(() => {
    setReadIds(loadReadIds(userId, companyId))
  }, [userId, companyId])

  const markAsRead = useCallback(
    (id: string) => {
      setReadIds((prev) => {
        const next = new Set(prev)
        next.add(id)
        saveReadIds(userId, companyId, next)
        return next
      })
    },
    [userId, companyId]
  )

  const markAllAsRead = useCallback(
    (ids: string[]) => {
      if (ids.length === 0) return
      setReadIds((prev) => {
        const next = new Set(prev)
        ids.forEach((id) => next.add(id))
        saveReadIds(userId, companyId, next)
        return next
      })
    },
    [userId, companyId]
  )

  const isRead = useCallback((id: string) => readIds.has(id), [readIds])

  return { readIds, markAsRead, markAllAsRead, isRead }
}
