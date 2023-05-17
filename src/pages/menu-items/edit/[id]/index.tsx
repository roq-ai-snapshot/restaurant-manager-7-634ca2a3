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
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik } from 'formik';
import { getMenu_itemsById, updateMenu_itemsById } from 'apiSdk/menu_items';
import { Error } from 'components/error';
import { Menu_itemsInterface } from 'interfaces/menu_items';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { MenusInterface } from 'interfaces/menus';
import { getMenus } from 'apiSdk/menus';

function Menu_itemsEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<Menu_itemsInterface>(id, getMenu_itemsById);
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: Menu_itemsInterface, { resetForm }) => {
    setFormError(null);
    try {
      const updated = await updateMenu_itemsById(id, values);
      mutate(updated);
      resetForm();
      router.push('/menu-items');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<Menu_itemsInterface>({
    initialValues: data,
    validationSchema: yup.object().shape({
      name: yup.string().required(),
      description: yup.string(),
      price: yup.number().integer().required(),
      menu_id: yup.string(),
    }),
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Menu_items
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="name" mb="4" isInvalid={!!formik.errors.name}>
              <FormLabel>Name</FormLabel>
              <Input type="text" name="name" value={formik.values.name} onChange={formik.handleChange} />
              {formik.errors.name && <FormErrorMessage>{formik.errors.name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="description" mb="4" isInvalid={!!formik.errors.description}>
              <FormLabel>Description</FormLabel>
              <Input type="text" name="description" value={formik.values.description} onChange={formik.handleChange} />
              {formik.errors.description && <FormErrorMessage>{formik.errors.description}</FormErrorMessage>}
            </FormControl>
            <FormControl id="price" mb="4" isInvalid={!!formik.errors.price}>
              <FormLabel>price</FormLabel>
              <NumberInput
                name="price"
                value={formik.values.price}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('price', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.price && <FormErrorMessage>{formik.errors.price}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<MenusInterface>
              formik={formik}
              name={'menu_id'}
              label={'Menus'}
              placeholder={'Select Menus'}
              fetcher={getMenus}
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
        )}
      </Box>
    </AppLayout>
  );
}

export default Menu_itemsEditPage;
