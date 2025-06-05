import './App.css'
import "./index.css";
import Layout from './Layout.js'
import {ThemeProvider} from "@/lib/theme-provider";


function App() {
    return (
        <ThemeProvider>
            <Layout/>
        </ThemeProvider>
    )
}

export default App
