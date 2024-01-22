import { Edit as AntdEdit, useForm, useSelect } from '@refinedev/antd';
import { GetFields, GetFieldsFromList } from '@refinedev/nestjs-query';
import { Col, Form, Input, InputNumber, Row, Select } from 'antd';

import { UPDATE_COMPANY_MUTATION } from '@/graphql/mutations';
import { UpdateCompanyMutation, UsersSelectQuery } from '@/graphql/types';
import { USERS_SELECT_QUERY } from '@/graphql/queries';
import { getNameInitials } from '@/utils';
import {
  businessTypeOptions,
  companySizeOptions,
  industryOptions,
} from '@/constants';

import CustomAvatar from '@/components/custom-avatar';
import SelectOptionWithAvatar from '@/components/select-option-with-avatar';
import { CompanyContactsTable } from './contacts-table';

export const Edit = () => {
  const { saveButtonProps, formProps, formLoading, queryResult } = useForm<
    GetFields<UpdateCompanyMutation>
  >({
    redirect: false,
    meta: {
      gqlQuery: UPDATE_COMPANY_MUTATION,
    },
  });

  const { avatarUrl, name } = queryResult?.data?.data || {};

  const { selectProps, queryResult: queryResultUsers } = useSelect<
    GetFieldsFromList<UsersSelectQuery>
  >({
    resource: 'users',
    optionLabel: 'name',
    pagination: {
      mode: 'off',
    },
    meta: {
      gqlMutation: USERS_SELECT_QUERY,
    },
  });

  return (
    <div>
      <Row gutter={[32, 32]}>
        <Col
          xs={24}
          xl={12}>
          <AntdEdit
            isLoading={formLoading}
            saveButtonProps={saveButtonProps}
            breadcrumb={false}>
            <Form
              {...formProps}
              layout='vertical'>
              <CustomAvatar
                shape='square'
                src={avatarUrl}
                name={getNameInitials(name || '')}
                style={{ width: 96, height: 96, marginBottom: '24px' }}
              />

              <Form.Item
                label='Sales owner'
                name={'salesOwnerId'}
                initialValue={formProps?.initialValues?.salesOwner?.id}>
                <Select
                  {...selectProps}
                  placeholder='Please select a sales owner'
                  options={
                    queryResultUsers.data?.data.map((user) => ({
                      value: user.id,
                      label: (
                        <SelectOptionWithAvatar
                          name={user.name}
                          avatarUrl={user.avatarUrl ?? undefined}
                        />
                      ),
                    })) ?? []
                  }
                />
              </Form.Item>

              <Form.Item label='Company size'>
                <Select options={companySizeOptions} />
              </Form.Item>

              <Form.Item label='Total revenue'>
                <InputNumber
                  autoFocus
                  addonBefore='$'
                  min={0}
                  placeholder='0,00'
                />
              </Form.Item>

              <Form.Item label='Industry'>
                <Select options={industryOptions} />
              </Form.Item>

              <Form.Item label='Business type'>
                <Select options={businessTypeOptions} />
              </Form.Item>

              <Form.Item
                label='Country'
                name={'country'}>
                <Input placeholder='Country' />
              </Form.Item>

              <Form.Item
                label='Website'
                name={'website'}>
                <Input placeholder='Website' />
              </Form.Item>
            </Form>
          </AntdEdit>
        </Col>

        <Col
          xs={24}
          xl={12}>
          <CompanyContactsTable />
        </Col>
      </Row>
    </div>
  );
};
