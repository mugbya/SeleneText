import './App.css'
import "./index.css";
import Layout from './Layout'
import {ThemeProvider} from "@/lib/theme-provider";


function App() {
    return (
        <ThemeProvider>
            <Layout/>
        </ThemeProvider>
    )
}

export default App
