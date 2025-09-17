import { VendorAnalyticsCards } from "@/components/VendorAnalyticsCards"
import { VendorsTable } from "@/components/VendorsTable"
import { useEffect } from "react"

const Vendors = () => {
  useEffect(() => {
    document.title = "Vendors - VendorHub"
  }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      <VendorAnalyticsCards />
      <VendorsTable />
    </div>
  )
}

export default Vendors