"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type DateContextType = {
  selectedDate: Date
  setSelectedDate: (date: Date) => void
}

const DateContext = createContext<DateContextType | undefined>(undefined)

export function DateProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  return <DateContext.Provider value={{ selectedDate, setSelectedDate }}>{children}</DateContext.Provider>
}

export function useDate() {
  const context = useContext(DateContext)
  if (context === undefined) {
    throw new Error("useDate must be used within a DateProvider")
  }
  return context
}
