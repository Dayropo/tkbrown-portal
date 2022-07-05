import { data } from "autoprefixer"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const LineChart = ({ entries }) => {
  const data = {
    labels: entries?.map(entry => entry.posted_at),
    datasets: [
      {
        label: "Revenue",
        data: entries?.map(entry => entry.revenue),
        yAxisID: "y",
      },
      {
        label: "Impressions",
        data: entries?.map(entry => entry.impressions),
        yAxisID: "y1",
      },
      {
        label: "eCPM",
        data: entries?.map(entry => entry.eCPM),
        yAxisID: "y2",
      },
    ],
  }

  const options = {
    elements: {
      line: {
        tension: 0.8,
        fill: "start",
        borderWidth: 2,
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        beginAtZero: true,
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        beginAtZero: true,

        // grid line settings
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
      },
      y2: {
        type: "linear",
        display: true,
        position: "right",
        beginAtZero: true,

        // grid line settings
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
      },
    },
  }

  return <Line data={data} height={40} width={100} options={options} />
}

export default LineChart
