'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useDjangoAuth } from '@/hooks/useDjangoAuth';
import { djangoApiClient } from '@/lib/django-api';
import type { Asset } from '@/types';

interface WarrantyModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
}

type ModalStep = 'login' | 'warranty';

export const WarrantyModal: React.FC<WarrantyModalProps> = ({ isOpen, onClose, asset }) => {
  const { isLoading, error, isAuthenticated, login, logout } = useDjangoAuth();
  const [step, setStep] = useState<ModalStep>('login');
  const [warrantyLoading, setWarrantyLoading] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });

  // Warranty form state
  const [warrantyForm, setWarrantyForm] = useState({
    asset_id: asset?.id || '',
    asset_name: asset?.name || '',
    serial_number: '',
    purchase_date: asset?.date_purchased || '',
  });

  // Update form when asset changes
  useEffect(() => {
    if (asset) {
      setWarrantyForm({
        asset_id: asset.id,
        asset_name: asset.name,
        serial_number: '',
        purchase_date: asset.date_purchased,
      });
      console.log('[WarrantyModal] Asset updated:', asset.id, asset.name);
    }
  }, [asset, isOpen]);

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await login(loginForm);
    if (success) {
      setStep('warranty');
      toast.success('Logged in successfully');
    }
  };

  const handleWarrantySubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('[WarrantyModal] Submitting warranty form with data:', warrantyForm);
    setWarrantyLoading(true);

    try {
      console.log('[WarrantyModal] Calling registerWarranty...');
      const response = await djangoApiClient.registerWarranty({
        asset_id: warrantyForm.asset_id,
        asset_name: warrantyForm.asset_name,
        serial_number: warrantyForm.serial_number,
        purchase_date: warrantyForm.purchase_date,
      });

      console.log('[WarrantyModal] Response:', response);

      if (response.success) {
        toast.success('Warranty registered successfully!');
        handleClose();
      } else {
        toast.error(response.message || 'Failed to register warranty');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register warranty';
      console.error('[WarrantyModal] Error:', err);
      toast.error(errorMessage);
    } finally {
      setWarrantyLoading(false);
    }
  };

  const handleClose = () => {
    setStep('login');
    setLoginForm({ username: '', password: '' });
    setWarrantyForm({
      asset_id: asset?.id || '',
      asset_name: asset?.name || '',
      serial_number: '',
      purchase_date: asset?.date_purchased || '',
    });
    logout();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Register Asset Warranty">
      <div className="w-full max-w-md">
        {/* Login Step */}
        {step === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={loginForm.username}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setLoginForm({ ...loginForm, username: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={loginForm.password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        )}

        {/* Warranty Registration Step */}
        {step === 'warranty' && (
          <form onSubmit={handleWarrantySubmit} className="space-y-4">
            <div>
              <Label htmlFor="asset_name">Asset Name</Label>
              <Input
                id="asset_name"
                type="text"
                placeholder="e.g., MacBook Pro"
                value={warrantyForm.asset_name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setWarrantyForm({ ...warrantyForm, asset_name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="serial_number">Serial Number</Label>
              <Input
                id="serial_number"
                type="text"
                placeholder="e.g., SN12345678"
                value={warrantyForm.serial_number}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setWarrantyForm({ ...warrantyForm, serial_number: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="purchase_date">Purchase Date</Label>
              <Input
                id="purchase_date"
                type="date"
                value={warrantyForm.purchase_date}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setWarrantyForm({ ...warrantyForm, purchase_date: e.target.value })
                }
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setStep('login');
                  logout();
                }}
              >
                Back
              </Button>
              <button 
                type="submit" 
                disabled={warrantyLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {warrantyLoading ? 'Loading...' : 'Register Warranty'}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
