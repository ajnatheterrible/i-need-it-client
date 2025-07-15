import { Routes, Route } from "react-router-dom";
import useIsOnline from "./hooks/useIsOnline";

import AuthInitializer from "./components/auth/AuthInitializer";
import OfflinePage from "./pages/root/Offline";
import Layout from "./components/layout/Layout";
import Landing from "./pages/root/Landing";
import Favorites from "./pages/Favorites";
import Sell from "./pages/Sell";
import Messages from "./pages/Messages";
import Profile from "./pages/account/Profile";
import Purchases from "./pages/Purchases";
import SearchResults from "./pages/SearchResults";
import Listing from "./pages/Listing";
import Checkout from "./pages/Checkout";
import ProfileSettings from "./pages/account/ProfileSettings";
import Addresses from "./pages/account/Addresses";
import Sizes from "./pages/account/Sizes";
import Payments from "./pages/Payments";
import Notifications from "./pages/Notifications";
import Help from "./pages/static/Help";
import NotFound from "./pages/root/NotFound";
import About from "./pages/static/About";
import Privacy from "./pages/static/Privacy";
import Accessibility from "./pages/static/Accessibility";
import Contact from "./pages/static/ContactUs";
import Designers from "./pages/Designers";
import ForSale from "./pages/ForSale";
import Feedback from "./pages/static/Feedback";
import Drafts from "./pages/Drafts";
import Sold from "./pages/Sold";
import PaymentsSeller from "./pages/PaymentsSeller";
import SellerSettings from "./pages/SellerSettings";
import UserLayout from "./components/profile/UserLayout";
import UserFavorites from "./pages/UserFavorites";
import UserReviews from "./pages/UserReviews";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import CompleteSignup from "./pages/static/CompleteSignup";
import ForgotPassword from "./pages/static/ForgotPassword";
import DraftsSkeleton from "./components/skeletons/DraftsSkeleton";

import posthog from "posthog-js";

posthog.init(import.meta.env.VITE_POSTHOG_API_KEY, {
  api_host: "https://app.posthog.com",
});

export default function App() {
  const isOnline = useIsOnline();

  if (!isOnline) {
    return <OfflinePage />;
  }

  return (
    <AuthInitializer>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />

          <Route element={<ProtectedRoute />}>
            <Route path="favorites" element={<Favorites />} />
            <Route path="sell" element={<Sell />} />
            <Route path="sell/draft/:draftId" element={<Sell />} />
            <Route path="sell/edit/:editId" element={<Sell />} />
            <Route path="messages" element={<Messages />} />
            <Route path="profile" element={<UserLayout />}>
              <Route index element={<Profile />} />
              <Route path="favorites" element={<UserFavorites />} />
              <Route path="reviews" element={<UserReviews />} />
            </Route>
            <Route path="purchases" element={<Purchases />} />
            <Route path="profile-settings" element={<ProfileSettings />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="sizes" element={<Sizes />} />
            <Route path="payments" element={<Payments />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="for-sale" element={<ForSale />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="sold" element={<Sold />} />
            <Route path="drafts" element={<Drafts />} />
            <Route path="drafts/skeleton" element={<DraftsSkeleton />} />
            <Route path="payments-seller" element={<PaymentsSeller />} />
            <Route path="settings-seller" element={<SellerSettings />} />
          </Route>

          <Route path="shop" element={<SearchResults />} />
          <Route path="listing/:id" element={<Listing />} />
          <Route path="listing" element={<Listing />} />
          <Route path="help" element={<Help />} />
          <Route path="about" element={<About />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="accessibility" element={<Accessibility />} />
          <Route path="contact-us" element={<Contact />} />
          <Route path="designers" element={<Designers />} />
          <Route path="forgot-password" element={<ForgotPassword />} />

          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        <Route path="complete-signup" element={<CompleteSignup />} />
      </Routes>
    </AuthInitializer>
  );
}
