import { FiX } from "react-icons/fi"
import useSWR from "swr"
import { fetcher } from "../../lib/fetcher"

const Modal = ({ selectedId, setSelectedId }) => {
  const { data: client, error } = useSWR(`/api/clients/${selectedId}`, fetcher)
  const { data: sum, error: sumError } = useSWR(
    `/api/entries/${selectedId}/sum`,
    fetcher
  )
  const eCPM = (sum?.total_revenue / sum?.total_impressions) * 1000

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 h-full w-full flex items-center z-50">
      {/**modal content */}
      <div className="relative py-5 mx-auto border min-w-1/2 shadow-xl rounded-md bg-white text-black">
        <button
          className="absolute -top-3 -right-3 bg-white shadow-md rounded-full p-2.5 text-sm text-center text-black"
          onClick={() => setSelectedId("")}
        >
          <FiX size={20} />
        </button>

        {client && (
          <div className="px-8 py-1.5">
            <p className="font-semibold text-3xl mb-2.5">{`${client?.company}`}</p>
            <p className="font-semibold text-2xl mb-2.5">Summary</p>
            {sum && (
              <div className="text-lg">
                <p>{`Total Revenue: ${sum?.total_revenue} €`} </p>
                <p>{`Total Impressions: ${sum?.total_impressions}`}</p>
                <p>{`eCPM: ${eCPM.toFixed(2)} €`}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
