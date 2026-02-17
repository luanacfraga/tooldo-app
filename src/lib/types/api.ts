export type NotificationPreference = 'sms_only' | 'whatsapp_only' | 'both'

export interface Company {
  id: string
  name: string
  description?: string
  adminId: string
  notificationPreference: NotificationPreference
  createdAt: string
  updatedAt: string
}

export interface CreateCompanyRequest {
  name: string
  description?: string
  adminId: string
  notificationPreference?: NotificationPreference
}

export interface UpdateCompanyRequest {
  name?: string
  description?: string
  notificationPreference?: NotificationPreference
}

export type EmployeeRole = 'admin' | 'manager' | 'executor' | 'consultant'
export type EmployeeStatus = 'INVITED' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED' | 'REMOVED'

export interface Employee {
  id: string
  userId: string
  companyId: string
  role: EmployeeRole
  status: EmployeeStatus
  position?: string | null
  notes?: string | null
  invitedAt?: string | null
  acceptedAt?: string | null
  invitedBy?: string | null
  user?: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    document: string
    role: string
    initials?: string | null
    avatarColor?: string | null
  }
}

export interface InviteEmployeeRequest {
  companyId: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  document?: string
  role: EmployeeRole
  position?: string
  notes?: string
}
