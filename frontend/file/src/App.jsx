import React, { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import GroceryLoader from './components/Loading.jsx'
import Protection from '../Router/Protective.jsx'
import OurStory from './page/OurStory.jsx'
import LabPurityReport from './page/LabPurityReport.jsx'
import WishlistPage from './wishlist/wishlist.jsx'
import CreateProduct from './Admin/CreateProduct.jsx'
// import CartPage from '../cart/cart.jsx'

// Lazy-loaded route components (code-split into separate bundles)
const HomePage = lazy(() => import('./page/Home.jsx'))
const SignupUI = lazy(() => import('./page/signup.jsx'))
const Login = lazy(() => import('./page/login.jsx'))
const CollectionPage = lazy(() => import('./page/CollectionPage.jsx'))
const AdminLogin = lazy(() => import('./Admin/admin.jsx'))
const CartPage=lazy(()=>import ("./cart/cart.jsx"))
const ForgotPassword = lazy(() => import('./page/ForgotPassword.jsx'))
const Logout = lazy(() => import('./page/Logout.jsx'))
const Terms = lazy(() => import('./page/Terms.jsx'))
const App = () => {
  return (
    <div>
      <Suspense fallback={<GroceryLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignupUI />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/terms-and-conditions" element={<Terms />} />
          <Route path="/terms-of-condition" element={<Terms />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ForgotPassword />} />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/shop"
            element={
              <Protection>
                <CollectionPage />
              </Protection>
            }
          />
          <Route path="/Admin_login" element={<AdminLogin />} />

          <Route path='/cart' element={<CartPage/>}/>

          <Route path='/our-story' element={<OurStory/>}/>
          <Route path='/purity' element={<LabPurityReport/>}/>
          <Route path='/wishlist' element={<WishlistPage/>}/>
          <Route path='/_upload_Product' element={<CreateProduct/>}/>
        </Routes>
      </Suspense>
    </div>
  )
}

export default App