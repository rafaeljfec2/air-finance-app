import { createBank, deleteBank, getBankByCode, updateBank, type Bank } from '@/services/bankService';
import React, { useState } from 'react';

interface UseBankForm {
  values: Bank;
  errors: Partial<Record<keyof Bank, string>>;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (onSuccess?: (bank: Bank) => void) => Promise<void>;
  reset: () => void;
  getBankByCode: (code: string) => Promise<Bank | null>;
  updateBank: (code: string, data: Partial<Bank>) => Promise<Bank | null>;
  deleteBank: (code: string) => Promise<boolean>;
}

const initialValues: Bank = {
  code: '',
  ispb: '',
  name: '',
  shortName: '',
  type: 'banco',
  pixDirect: false,
  active: true,
};

export function useBankForm(): UseBankForm {
  const [values, setValues] = useState<Bank>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof Bank, string>>>({});
  const [loading, setLoading] = useState(false);

  function validate(values: Bank) {
    const newErrors: Partial<Record<keyof Bank, string>> = {};
    if (!values.code) newErrors.code = 'Código obrigatório';
    if (!values.name) newErrors.name = 'Nome obrigatório';
    return newErrors;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(onSuccess?: (bank: Bank) => void) {
    setLoading(true);
    const validation = validate(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      setLoading(false);
      return;
    }
    try {
      const created = await createBank(values);
      if (onSuccess) onSuccess(created);
      reset();
    } finally {
      setLoading(false);
    }
  }

  async function getBankByCodeHandler(code: string): Promise<Bank | null> {
    setLoading(true);
    try {
      const bank = await getBankByCode(code);
      setValues(bank);
      setErrors({});
      return bank;
    } catch (error) {
      setErrors({ code: 'Banco não encontrado' + error });
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function updateBankHandler(code: string, data: Partial<Bank>): Promise<Bank | null> {
    setLoading(true);
    try {
      const updated = await updateBank(code, data);
      setValues(updated);
      setErrors({});
      return updated;
    } catch (error) {
      setErrors({ code: 'Erro ao atualizar banco' + error });
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function deleteBankHandler(code: string): Promise<boolean> {
    setLoading(true);
    try {
      await deleteBank(code);
      reset();
      return true;
    } catch (error) {
      setErrors({ code: 'Erro ao deletar banco' + error });
      return false;
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setValues(initialValues);
    setErrors({});
  }

  return {
    values,
    errors,
    loading,
    handleChange,
    handleSubmit,
    reset,
    getBankByCode: getBankByCodeHandler,
    updateBank: updateBankHandler,
    deleteBank: deleteBankHandler,
  };
}
