import useSWR from "swr"
import { fetcher } from "../../lib/fetcher"

const Payments = ({ user, company }) => {
  const { data: sum, error: sumError } = useSWR(
    `/api/entries/sum/last-month?email=${user?.email}&company=${company}`,
    fetcher
  )

  if (sum) {
    return (
      <div className="py-4 space-y-4">
        <div className="p-12 border border-gray-200 rounded-md flex items-center">
          <p className="text-lg font-semibold">
            Your last month&apos;s earnings: {sum?.total_revenue}€
          </p>
        </div>
        <div className="p-12 border border-gray-200 rounded-md flex items-center">
          <p className="text-lg font-semibold">Invoices</p>
        </div>
      </div>
    )
  }
}

export default Payments
