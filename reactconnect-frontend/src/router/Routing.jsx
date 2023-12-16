import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PublicLayout } from '../components/layout/public/PublicLayout'
import { Login } from '../components/users/Login'
import { Register } from '../components/users/Register'
import { Privatelayout } from '../components/layout/private/Privatelayout'
import { Feed } from '../components/publications/Feed'
import { Error } from '../components/layout/Error'
import { AuthProvider } from '../context/AuthProvider'
import { Logout } from '../components/users/Logout'
import { People } from '../components/users/People'
import { Config } from '../components/users/Config'
import { Following } from '../components/follows/Following'
import { Followers } from '../components/follows/Followers'
import { Profile } from '../components/users/Profile'

export const Routing = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path='/' element={<PublicLayout />}>
                        <Route index element={<Login />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/register' element={<Register />} />
                    </Route>

                    <Route path='/social' element={<Privatelayout />}>
                        <Route index element={<Feed />} />
                        <Route path='feed' element={<Feed />} />
                        <Route path='people' element={<People />} />
                        <Route path='settings' element={<Config />} />
                        <Route path='following/:userid' element={<Following />} />
                        <Route path='followers/:userid' element={<Followers />} />
                        <Route path='profile/:userid' element={<Profile />} />
                        <Route path='logout' element={<Logout />} />
                    </Route>

                    <Route path='*' element={<Error />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}
