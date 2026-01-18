import { useState, useCallback, type FormEvent } from 'react';
import { Account } from '@/services/accountService';
import {
  setupBankingIntegration,
  fileToText,
  validateCertificate,
  validatePrivateKey,
  validatePixKey,
  type BankCredentials,
} from '@/services/bankingIntegrationService';
import { toast } from '@/components/ui/toast';
import { useCompanies } from '@/hooks/useCompanies';

interface UseBankingIntegrationProps {
  account: Account;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  pixKey: string;
  bankCode: string;
  accountNumber: string;
  clientId: string;
  clientSecret: string;
}

export function useBankingIntegration({
  account,
  onClose,
  onSuccess,
}: UseBankingIntegrationProps) {
  const { companies } = useCompanies();
  const [isLoading, setIsLoading] = useState(false);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [privateKeyFile, setPrivateKeyFile] = useState<File | null>(null);
  const [certificateContent, setCertificateContent] = useState<string>('');
  const [privateKeyContent, setPrivateKeyContent] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<FormData>({
    pixKey: account.pixKey || '',
    bankCode: account.bankCode || '077',
    accountNumber: account.accountNumber || '',
    clientId: '',
    clientSecret: '',
  });

  const handleChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const handleCertificateUpload = useCallback(async (file: File) => {
    try {
      const content = await fileToText(file);
      
      if (!validateCertificate(content)) {
        setErrors((prev) => ({
          ...prev,
          certificate: 'Certificado inválido. Verifique se é um arquivo .crt válido.',
        }));
        return;
      }

      setCertificateFile(file);
      setCertificateContent(content);
      setErrors((prev) => ({ ...prev, certificate: '' }));
    } catch (error) {
      console.error('Error processing certificate:', error);
      setErrors((prev) => ({
        ...prev,
        certificate: 'Erro ao processar certificado.',
      }));
    }
  }, []);

  const handleCertificateRemove = useCallback(() => {
    setCertificateFile(null);
    setCertificateContent('');
    setErrors((prev) => ({ ...prev, certificate: '' }));
  }, []);

  const handlePrivateKeyUpload = useCallback(async (file: File) => {
    try {
      const content = await fileToText(file);
      
      if (!validatePrivateKey(content)) {
        setErrors((prev) => ({
          ...prev,
          privateKey: 'Chave privada inválida. Verifique se é um arquivo .key válido.',
        }));
        return;
      }

      setPrivateKeyFile(file);
      setPrivateKeyContent(content);
      setErrors((prev) => ({ ...prev, privateKey: '' }));
    } catch (error) {
      console.error('Error processing private key:', error);
      setErrors((prev) => ({
        ...prev,
        privateKey: 'Erro ao processar chave privada.',
      }));
    }
  }, []);

  const handlePrivateKeyRemove = useCallback(() => {
    setPrivateKeyFile(null);
    setPrivateKeyContent('');
    setErrors((prev) => ({ ...prev, privateKey: '' }));
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate Pix Key
    if (formData.pixKey.trim() === '') {
      newErrors.pixKey = 'Chave Pix é obrigatória';
    } else {
      const pixValidation = validatePixKey(formData.pixKey);
      if (pixValidation.valid === false) {
        newErrors.pixKey = 'Chave Pix inválida';
      }
    }

    // Validate Account Number
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Número da conta é obrigatório';
    }

    // Validate Client ID
    if (!formData.clientId.trim()) {
      newErrors.clientId = 'Client ID é obrigatório';
    }

    // Validate Client Secret
    if (!formData.clientSecret.trim()) {
      newErrors.clientSecret = 'Client Secret é obrigatório';
    }

    // Validate Certificate
    if (!certificateFile || !certificateContent) {
      newErrors.certificate = 'Certificado digital é obrigatório';
    }

    // Validate Private Key
    if (!privateKeyFile || !privateKeyContent) {
      newErrors.privateKey = 'Chave privada é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, certificateFile, certificateContent, privateKeyFile, privateKeyContent]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      // Previne múltiplos submits
      if (isLoading) {
        return;
      }

      if (!validateForm()) {
        toast({
          title: 'Erro de validação',
          description: 'Verifique os campos obrigatórios.',
          type: 'error',
        });
        return;
      }

      setIsLoading(true);

      try {
        // Get company info from account
        const company = companies?.find((c) => c.id === account.companyId);
        
        if (!company) {
          throw new Error('Empresa não encontrada. Verifique se a conta está associada a uma empresa válida.');
        }

        if (!company.cnpj) {
          throw new Error('CNPJ da empresa não cadastrado. Atualize os dados da empresa antes de configurar a integração.');
        }

        if (!company.email) {
          throw new Error('Email da empresa não cadastrado. Atualize os dados da empresa antes de configurar a integração.');
        }
        
        // Prepare bank credentials
        const bankCredentials: BankCredentials = {
          bankCode: formData.bankCode,
          clientId: formData.clientId,
          clientSecret: formData.clientSecret,
          certificate: certificateContent,
          privateKey: privateKeyContent,
          accountNumber: formData.accountNumber,
        };

        // Call API to setup integration
        const response = await setupBankingIntegration(account.id, {
          name: company.name,
          document: company.cnpj,
          email: company.email || '',
          pixKey: formData.pixKey,
          bankCredentials,
        });

        if (response.success) {
          toast({
            title: 'Integração configurada!',
            description: 'A integração bancária foi configurada com sucesso.',
            type: 'success',
          });

          onSuccess?.();
          onClose();
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro ao configurar a integração bancária.';
        console.error('Error setting up banking integration:', error);
        
        toast({
          title: 'Erro ao configurar integração',
          description: errorMessage,
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [
      isLoading,
      validateForm,
      account,
      companies,
      formData,
      certificateContent,
      privateKeyContent,
      onSuccess,
      onClose,
    ],
  );

  return {
    formData,
    isLoading,
    certificateFile,
    privateKeyFile,
    errors,
    handleChange,
    handleCertificateUpload,
    handleCertificateRemove,
    handlePrivateKeyUpload,
    handlePrivateKeyRemove,
    handleSubmit,
  };
}
