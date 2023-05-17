import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createPayments } from 'apiSdk/payments';
import { Error } from 'components/error';
import { PaymentsInterface } from 'interfaces/payments';
import { AsyncSelect } from 'components/async-select';
import { OrdersInterface } from 'interfaces/orders';
import { getOrders } from 'apiSdk/orders';

function PaymentsCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PaymentsInterface, { resetForm }) => {
    setError(null);
    try {
      await createPayments(values);
      resetForm();
      router.push('/payments');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PaymentsInterface>({
    initialValues: {
      amount: 0,
      status: '',
      order_id: '',
    },
    validationSchema: yup.object().shape({
      amount: yup.number().integer().required(),
      status: yup.string().required(),
      order_id: yup.string(),
    }),
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Payments
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="amount" mb="4" isInvalid={!!formik.errors.amount}>
            <FormLabel>amount</FormLabel>
            <NumberInput
              name="amount"
              value={formik.values.amount}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('amount', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.amount && <FormErrorMessage>{formik.errors.amount}</FormErrorMessage>}
          </FormControl>
          <FormControl id="status" mb="4" isInvalid={!!formik.errors.status}>
            <FormLabel>Status</FormLabel>
            <Input type="text" name="status" value={formik.values.status} onChange={formik.handleChange} />
            {formik.errors.status && <FormErrorMessage>{formik.errors.status}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<OrdersInterface>
            formik={formik}
            name={'order_id'}
            label={'Orders'}
            placeholder={'Select Orders'}
            fetcher={getOrders}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record.id}
              </option>
            )}
          />
          <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default PaymentsCreatePage;
