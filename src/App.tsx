
import Home from './assets/images/Home.jpg'
import Todo from './components/Todo'

function App() {


  return (
    <div className="w-screen h-screen bg-no-repeat bg-cover relative" style={{ backgroundImage: `url(${Home})` }}>
      <div className="w-screen h-screen absloute inset-0 bg-[rgba(0,0,0,0.5)]">
          <Todo />
      </div>
    </div>
  )
}

export default App
