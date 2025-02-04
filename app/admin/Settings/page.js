"use client"
import Header from "../components/common/Header/page";
import ConnectedAccounts from "../components/settings/ConnectedAccounts/page";
import SignOut from "../components/settings/SignOut/page";
import Notifications from "../components/settings/Notifications/page";
import Profile from "../components/settings/Profile/page";
import Security from "../components/settings/Security/page";
import Sidebar from "../components/common/Sidebar/page";

const SettingsPage = () => {
	return (
		<div className="flex h-screen bg-gray-900">
			{/* Sidebar */}
			<Sidebar />
			<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
				<Header title='Settings' />
				<main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
					<Profile />
					{/* <Notifications />
					<Security />
					<ConnectedAccounts /> */}
					<SignOut />
				</main>
			</div>
		</div>
	);
};
export default SettingsPage;
