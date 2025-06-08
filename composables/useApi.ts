interface ApiResponse<T = any> {
  data?: T
  error?: string
}

export const useApi = () => {
  const makeRequest = async <T>(url: string, options?: RequestInit): Promise<T> => {
    console.log({options})
    try {
      // Ensure body is JSON-serializable if present
      if (options?.body && typeof options.body !== 'string') {
        options.body = JSON.stringify(options.body)
      }
      const response = await $fetch<T>(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        },
        ...options
      })
      return response
    } catch (error: any) {
      console.error('API Error:', error)
      
      let errorMessage = 'An error occurred'
      
      // Check through properties for an accessible error message
      if (error?.response?.data?.statusMessage) {
        errorMessage = error.response.data.statusMessage
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.statusMessage) {
        errorMessage = error.statusMessage
      } else if (error.message) {
        errorMessage = error.message
      }
      
      throw new Error(errorMessage)
    }
  }

  return {
    get: <T>(url: string) => makeRequest<T>(url),
    post: <T>(url: string, body?: any) => makeRequest<T>(url, { method: 'POST', body }),
    patch: <T>(url: string, body?: any) => makeRequest<T>(url, { method: 'PATCH', body }),
    delete: <T>(url: string) => makeRequest<T>(url, { method: 'DELETE' })
  }
}