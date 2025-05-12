import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SettingsForm from '@/components/admin/settings/SettingsForm';

async function getSettings() {
  const settings = await prisma.setting.findMany();
  
  // Convert to a key-value object
  const settingsObject: Record<string, string> = {};
  settings.forEach((setting) => {
    settingsObject[setting.key] = setting.value;
  });
  
  return settingsObject;
}

export default async function SettingsPage() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== 'ADMIN') {
    redirect('/login');
  }
  
  const settings = await getSettings();
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Website Settings</h2>
          <SettingsForm settings={settings} />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Your Profile</h2>
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mr-4">
              {user.image ? (
                <img src={user.image} alt={user.name || 'User'} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl text-gray-500">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{user.name || 'User'}</h3>
              <p className="text-gray-500">{user.email}</p>
              <p className="text-sm text-blue-600 mt-1">
                Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()}
              </p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-gray-500 text-sm mb-4">
              You can update your profile information here.
            </p>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
