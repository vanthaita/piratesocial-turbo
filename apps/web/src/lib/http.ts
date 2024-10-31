// type CustomOptions = Omit<RequestInit, 'method'> & {
//   baseUrl?: string
// }

// const ENTITY_ERROR_STATUS = 422
// const AUTHENTICATION_ERROR_STATUS = 401

// type EntityErrorPayload = {
//   message: string
//   errors: {
//     field: string
//     message: string
//   }[]
// }

// export class HttpError extends Error {
//   status: number
//   payload: {
//     message: string
//     [key: string]: any
//   }
  
//   constructor({ status, payload }: { status: number; payload: any }) {
//     super(payload.message || 'Http Error')
//     this.status = status
//     this.payload = payload
//   }
// }

// export class EntityError extends HttpError {
//   payload: EntityErrorPayload
  
//   constructor({
//     status,
//     payload
//   }: {
//     status: typeof ENTITY_ERROR_STATUS
//     payload: EntityErrorPayload
//   }) {
//     super({ status, payload })
//     this.payload = payload
//   }
// }

// async function request<Response>(
//   method: string,
//   url: string,
//   { baseUrl, ...options }: CustomOptions = {}
// ): Promise<Response> {
//   const finalUrl = baseUrl ? `${baseUrl}${url}` : url
  
//   const config: RequestInit = {
//     method,
//     headers: {
//       'Content-Type': 'application/json',
//       ...(options.headers || {})
//     },
//     ...options,
//   }

//   try {
//     const response = await fetch(finalUrl, config)
//     const data = await response.json()

//     if (!response.ok) {
//       throw createError(response.status, data)
//     }

//     return data as Response
//   } catch (error) {
//     handleHttpError(error)
//     throw error
//   }
// }

// function createError(status: number, payload: any) {
//   if (status === ENTITY_ERROR_STATUS) {
//     return new EntityError({ status, payload })
//   }
  
//   return new HttpError({ status, payload })
// }

// function handleHttpError(error: any) {
//   if (error instanceof HttpError) {
//     console.error('HttpError:', error.payload.message)
//   } else {
//     console.error('Unknown error:', error)
//   }
  
//   throw error
// }

// const http = {
//   get<Response>(url: string, options?: Omit<CustomOptions, 'body'>) {
//     return request<Response>('GET', url, options)
//   },
//   post<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'>) {
//     return request<Response>('POST', url, { ...options, body: JSON.stringify(body) })
//   },
//   put<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'>) {
//     return request<Response>('PUT', url, { ...options, body: JSON.stringify(body) })
//   },
//   delete<Response>(url: string, options?: Omit<CustomOptions, 'body'>) {
//     return request<Response>('DELETE', url, options)
//   }
// }

// export default http
