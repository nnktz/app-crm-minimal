import { Authenticated, Refine } from '@refinedev/core';
import { DevtoolsPanel, DevtoolsProvider } from '@refinedev/devtools';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';

import { useNotificationProvider } from '@refinedev/antd';
import '@refinedev/antd/dist/reset.css';

import { authProvider, dataProvider, liveProvider } from './providers';

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from '@refinedev/react-router-v6';
import { App as AntdApp } from 'antd';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

import {
  CompanyList,
  Create as CompanyCreate,
  Edit as CompanyEdit,
  ForgotPassword,
  Home,
  Login,
  Register,
  TaskList,
  CreateTask,
  EditTask,
} from './pages';
import Layout from './components/layout';
import { resources } from './config/resources';

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <AntdApp>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              liveProvider={liveProvider}
              notificationProvider={useNotificationProvider}
              routerProvider={routerBindings}
              authProvider={authProvider}
              resources={resources}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: 'lkc6le-sHUEXg-HpIjtU',
                liveMode: 'auto',
              }}>
              <Routes>
                <Route
                  path='/login'
                  element={<Login />}
                />
                <Route
                  path='/register'
                  element={<Register />}
                />
                <Route
                  path='/forgot-password'
                  element={<ForgotPassword />}
                />
                <Route
                  element={
                    <Authenticated
                      key={'authenticated-layout'}
                      fallback={<CatchAllNavigate to='/login' />}>
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }>
                  <Route
                    index
                    element={<Home />}
                  />
                  <Route path='/companies'>
                    <Route
                      index
                      element={<CompanyList />}
                    />
                    <Route
                      path='new'
                      element={<CompanyCreate />}
                    />
                    <Route
                      path='edit/:id'
                      element={<CompanyEdit />}
                    />
                  </Route>
                  <Route
                    path='/tasks'
                    element={
                      <TaskList>
                        <Outlet />
                      </TaskList>
                    }>
                    <Route
                      path='new'
                      element={<CreateTask />}
                    />
                    <Route
                      path='new'
                      element={<CreateTask />}
                    />
                    <Route
                      path='edit/:id'
                      element={<EditTask />}
                    />
                  </Route>
                </Route>
              </Routes>
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </AntdApp>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
