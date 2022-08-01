import useSWR from "swr"
import { fetcher } from "../../lib/fetcher"
import { MdAddchart } from "react-icons/md"

const Billings = () => {
  const { data: billings, error: billingsError } = useSWR(
    `/api/clients/billings`,
    fetcher
  )

  return (
    <div className="py-4">
      <span className="font-semibold text-lg mb-8">Billings</span>

      {billings?.length > 0 ? (
        <div></div>
      ) : (
        <div className="flex h-[50vh] items-center justify-center">
          <div className="text-center">
            <MdAddchart size={200} className="text-purple-500" />
            <p className="font-medium text-gray-400">No data found</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Billings
