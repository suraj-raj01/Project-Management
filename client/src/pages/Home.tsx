import { Link } from "react-router-dom"

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center p-5 h-120">
      <h1 className="text-3xl font-bold text-center">Welcome to Team Task Manager</h1>
      <p className="mt-2 text-gray-600 text-center">Manage your team's tasks and projects efficiently.</p>
      <button className="mt-5 border p-3 rounded-sm bg-blue-500 text-white font-bold cursor-pointer">
        <Link to="/login">Get Started</Link>
      </button>
    </div>
  )
}

export default Home