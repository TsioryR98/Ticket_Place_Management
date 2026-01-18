'use client';
import { CiBookmark, CiSettings, CiMail, CiUser, CiLock } from 'react-icons/ci';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

const emailSchema = z.string().email('Invalid email format');
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');
const nameSchema = z.string().min(2, 'User name must be at least 2 characters');

export default function UserProfile() {
  const { data: session, status } = useSession();

  const user = session?.user as { name?: string; email?: string };
  const [newUserName, setNewUserName] = useState<string>('');
  const [newEmailAddress, setNewEmailAddress] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const formatName = (name?: string) => {
    return name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : 'N/A';
  };
  const isFormValid = () => {
    return newUserName !== '' || newEmailAddress !== '' || newPassword !== '' || oldPassword !== '';
  };

  const validateForm = () => {
    const validationErrors: { [key: string]: string } = {};

    if (newUserName && !nameSchema.safeParse(newUserName).success) {
      validationErrors.newUserName = 'User name must be at least 2 characters';
    }

    if (newEmailAddress && !emailSchema.safeParse(newEmailAddress).success) {
      validationErrors.newEmailAddress = 'Invalid email format';
    }

    if (newPassword && !passwordSchema.safeParse(newPassword).success) {
      validationErrors.newPassword = 'Password must meet security requirements';
    }

    if (newPassword && !oldPassword) {
      validationErrors.oldPassword = 'Old password is required to update the password';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me/settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({
          username: newUserName,
          email: newEmailAddress,
          password: newPassword,
          oldPassword: oldPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error || 'Failed to update profile' });
        toast.error('Something went wrong, Try again');
        return;
      }
      if (response.ok) {
        toast.success('Profile was updated successfully.', {
          onAutoClose: () => {
            toast.info('Sign out and back in to see changes.');
          },
        });

        setNewUserName('');
        setNewEmailAddress('');
        setNewPassword('');
        setOldPassword('');
        setErrors({});
      }
    } catch {
      setErrors({ general: 'An error occurred. Please try again.' });
    }
  };

  if (status === 'loading') {
    return (
      <div className="text-center">
        <p>Loading ...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="text-center mt-8 space-y-4">
        <h1 className="text-xl font-semibold text-amber-500">
          You need to Sign In to see this page
        </h1>
        <Link href={'/auth/login'}>
          <Button variant={'outline'}>Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center gap-x-10 justify-center mt-8">
      <div className="flex flex-col gap-y-8">
        <div className="p-5 shadow-md flex items-center flex-col cursor-pointer hover:shadow-xl transition-all duration-300">
          <h1 className="font-semibold text-lg flex items-center">
            Account Settings <CiSettings className="ms-4 text-2xl" />
          </h1>
          <p className="text-sm">Details about your information</p>
        </div>
        <Link href={`/dashboard/reservations`}>
          <div className="p-5 shadow-md flex items-center flex-col cursor-pointer hover:shadow-xl transition-all duration-300">
            <h1 className="font-semibold text-lg flex items-center">
              My reservations <CiBookmark className="ms-4 text-2xl" />
            </h1>
            <p className="text-sm">Check all of your bookings</p>
          </div>
        </Link>
      </div>
      <div className="flex flex-col gap-y-8">
        <div className="flex items-center  p-8 shadow-md hover:shadow-xl transition-all duration-300 justify-between">
          <div className="flex items-center gap-x-8">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-500 text-white text-2xl  font-semibold text-center">
              {formatName(user?.name)?.slice(0, 2)}
            </div>
            <h1>Your profile</h1>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant={'outline'} className="cursor-pointer">
                Update
              </Button>
            </SheetTrigger>
            <SheetContent className={'z-[10000]'}>
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when you&#39;re done.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="flex px-8 items-center">
                  <CiUser className="text-2xl absolute left-10" />
                  <Input
                    id="name"
                    className="text-right"
                    placeholder="New user name"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                  />
                </div>
                {errors.newUserName && (
                  <p className="text-red-500 text-sm text-center">{errors.newUserName}</p>
                )}
                <div className="flex px-8 items-center">
                  <CiMail className="text-2xl absolute left-10" />
                  <Input
                    id="username"
                    className="text-right"
                    placeholder="New email address"
                    value={newEmailAddress}
                    onChange={(e) => setNewEmailAddress(e.target.value)}
                  />
                </div>
                {errors.newEmailAddress && (
                  <p className="text-red-500 text-sm text-center">{errors.newEmailAddress}</p>
                )}
                <div className="flex px-8 items-center">
                  <CiLock className="text-2xl absolute left-10" />
                  <Input
                    type={'password'}
                    className="text-right"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-sm text-center">{errors.newPassword}</p>
                )}
                <div className="flex px-8 items-center">
                  <CiLock className="text-2xl absolute left-10" />
                  <Input
                    type={'password'}
                    className="text-right"
                    placeholder="Old password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button onClick={handleSubmit} disabled={!isFormValid()}>
                    Save changes
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        <div className="shadow-md p-8 hover:shadow-xl transition-all duration-300">
          <h1 className="mb-6 font-bold text-xl">Your informations</h1>
          <div className="grid grid-cols-2 gap-8">
            <span>
              <p>Full Name</p>
              <p className="font-semibold">{user?.name}</p>
            </span>
            <span>
              <p>Email Address</p>
              <p className="font-semibold">{user?.email || 'N/A'}</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
