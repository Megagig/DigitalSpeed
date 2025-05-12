'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FiSave } from 'react-icons/fi';

interface SettingsFormProps {
  settings: Record<string, string>;
}

export default function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      site_name: settings.site_name || 'DigitalSpeed',
      site_description: settings.site_description || 'A modern digital agency',
      contact_email: settings.contact_email || 'info@digitalspeed.com',
      contact_phone: settings.contact_phone || '(123) 456-7890',
      contact_address:
        settings.contact_address || '123 Digital Street, Tech City, TC 12345',
      social_facebook: settings.social_facebook || 'https://facebook.com/',
      social_twitter: settings.social_twitter || 'https://twitter.com/',
      social_instagram: settings.social_instagram || 'https://instagram.com/',
      social_linkedin: settings.social_linkedin || 'https://linkedin.com/',
    },
  });

  const onSubmit = async (data: Record<string, string>) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save settings');
      }

      setSuccess('Settings saved successfully');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="site_name"
            className="block text-sm font-medium text-gray-700"
          >
            Site Name
          </label>
          <input
            type="text"
            id="site_name"
            {...register('site_name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="site_description"
            className="block text-sm font-medium text-gray-700"
          >
            Site Description
          </label>
          <input
            type="text"
            id="site_description"
            {...register('site_description')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <h3 className="text-lg font-medium text-gray-900 pt-4">
        Contact Information
      </h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="contact_email"
            className="block text-sm font-medium text-gray-700"
          >
            Contact Email
          </label>
          <input
            type="email"
            id="contact_email"
            {...register('contact_email')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="contact_phone"
            className="block text-sm font-medium text-gray-700"
          >
            Contact Phone
          </label>
          <input
            type="text"
            id="contact_phone"
            {...register('contact_phone')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="contact_address"
            className="block text-sm font-medium text-gray-700"
          >
            Contact Address
          </label>
          <input
            type="text"
            id="contact_address"
            {...register('contact_address')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <h3 className="text-lg font-medium text-gray-900 pt-4">Social Media</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="social_facebook"
            className="block text-sm font-medium text-gray-700"
          >
            Facebook URL
          </label>
          <input
            type="url"
            id="social_facebook"
            {...register('social_facebook')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="social_twitter"
            className="block text-sm font-medium text-gray-700"
          >
            Twitter URL
          </label>
          <input
            type="url"
            id="social_twitter"
            {...register('social_twitter')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="social_instagram"
            className="block text-sm font-medium text-gray-700"
          >
            Instagram URL
          </label>
          <input
            type="url"
            id="social_instagram"
            {...register('social_instagram')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="social_linkedin"
            className="block text-sm font-medium text-gray-700"
          >
            LinkedIn URL
          </label>
          <input
            type="url"
            id="social_linkedin"
            {...register('social_linkedin')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSave size={16} className="mr-2" />
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}
