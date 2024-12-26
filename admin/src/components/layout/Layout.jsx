import Sidebar from '../common/Sidebar'
import { Toaster } from 'sonner'
const Layout = ({ children }) => {
    return (
        <div>
            <Sidebar />
            <div className="p-4 sm:ml-64">
                {children}
                <Toaster />
            </div>
        </div>
    )
}

export default Layout
