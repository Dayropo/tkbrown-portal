import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  BarController,
} from "chart.js"
import { Line, Chart } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  BarController
)

const LineChart = ({ entries }) => {
  const data = {
    labels: entries?.map(entry => entry.posted_at),
    datasets: [
      {
        label: "Revenue",
        data: entries?.map(entry => entry.revenue),
        yAxisID: "y",
        type: "line",
        backgroundColor: "rgb(96, 165, 250, 0.25)",
        borderColor: "rgb(96, 165, 250, 1)",
        borderWidth: 2,
      },
      {
        label: "Impressions",
        data: entries?.map(entry => entry.impressions),
        yAxisID: "y1",
        type: "bar",
        backgroundColor: "rgb(238, 220, 130, 0.3)",
        borderColor: "rgb(238, 220, 130, 0.5)",
        borderWidth: 2,
      },
      {
        label: "eCPM",
        data: entries?.map(entry => entry.eCPM),
        yAxisID: "y2",
        type: "line",
        backgroundColor: "rgb(248, 113, 113, 0.25)",
        borderColor: "rgb(248, 113, 113, 1)",
        borderWidth: 2,
      },
    ],
  }

  const options = {
    elements: {
      line: {
        tension: 0.5,
        fill: "start",
      },
      point: {
        radius: 0,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        beginAtZero: true,
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
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
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    maintainAspectRatio: false,
  }

  // return <Line data={data} height={40} width={100} options={options} />
  return <Chart type="bar" data={data} options={options} />
}

export default LineChart
