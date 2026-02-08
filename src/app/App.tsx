import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Header } from './components/Header';
import { FloatingWidget } from './components/FloatingWidget';
import { HomePage } from './pages/HomePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { BookingsPage } from './pages/BookingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ChatPage } from './pages/ChatPage';
import { HotelDetailPage } from './pages/HotelDetailPage';
import { BookingFormPage } from './pages/BookingFormPage';

export default function App() {
	return (
		<LanguageProvider>
			<AuthProvider>
				<Router>
					<div className="min-h-screen bg-background text-foreground">
						<Header />
						<main className="pt-6">
							<Routes>
								<Route path="/" element={<HomePage />} />
								<Route path="/favorites" element={<FavoritesPage />} />
								<Route path="/bookings" element={<BookingsPage />} />
								<Route path="/profile" element={<ProfilePage />} />
								<Route path="/chat" element={<ChatPage />} />
								<Route path="/hotel/:id" element={<HotelDetailPage />} />
								<Route path="/hotel/:id/book" element={<BookingFormPage />} />
							</Routes>
						</main>
						<FloatingWidget />
						<Toaster position="bottom-right" />
					</div>
				</Router>
			</AuthProvider>
		</LanguageProvider>
	);
}