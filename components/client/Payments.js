import Skeleton from "react-loading-skeleton"
import useSWR from "swr"
import { fetcher } from "../../lib/fetcher"

const Payments = ({ user, company }) => {
  const { data: sum, error: sumError } = useSWR(
    `/api/entries/sum/last-month?email=${user?.email}&company=${company}`,
    fetcher
  )

  const { data: invoices, error: invoiceError } = useSWR(
    `/api/invoice?client_email=${user?.email}&client_domain=${company}`,
    fetcher
  )

  if (sum) {
    return (
      <div className="py-4 space-y-4">
        <div className="p-3 sm:p-12 border border-gray-200 rounded-md flex items-center">
          <p className="text-lg font-semibold">
            Your last month&apos;s earnings: {sum?.total_revenue} €
          </p>
        </div>
        <div className="p-3 sm:p-12 border border-gray-200 rounded-md flex flex-col w-full">
          <p className="text-lg font-semibold">Invoices</p>

          {invoices?.length > 0 && (
            <div>
              <div className="mt-8 flex flex-col">
                <div className="flex w-full py-3 bg-purple-400 rounded-t-md text-white items-end">
                  <span className="w-1/4 text-center sm:text-base text-sm px-2.5">
                    Invoice No
                  </span>
                  <span className="w-1/4 text-center sm:text-base text-sm px-2.5">
                    Period
                  </span>
                  <span className="w-1/4 text-center sm:text-base text-sm px-2.5">
                    Amount
                  </span>
                  <span className="w-1/4 text-center sm:text-base text-sm px-2.5">
                    Status
                  </span>
                </div>
              </div>

              {/**invoice mapping */}
              {invoices?.map((item, index) => (
                <div
                  className={`${
                    index === invoices.length - 1 ? "rounded-b-md" : null
                  } flex w-full py-3 bg-white text-black items-center divide-x-1 divide-black`}
                  key={item?.id}
                >
                  <span className="w-1/4 text-center sm:text-base text-sm px-2.5 break-words">
                    {item?.invoice_number}
                  </span>
                  <span className="w-1/4 text-center sm:text-base text-sm px-2.5 break-words">
                    {item?.period}
                  </span>
                  <span className="w-1/4 text-center sm:text-base text-sm px-2.5 break-words">
                    {item?.amount}
                  </span>
                  <span className="w-1/4 text-center sm:text-base text-sm px-2.5 break-words">
                    {item?.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="py-4">
      <div className="w-full mt-5">
        <Skeleton height={120} />
      </div>

      <div className="mt-2.5 w-full">
        <Skeleton height={120} />
      </div>
    </div>
  )
}

export default Payments
