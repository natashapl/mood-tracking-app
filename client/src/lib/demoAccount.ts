export const DEMO_EMAIL = 'jane@demo.com';
export const DEMO_PASSWORD = 'Jane1234';

export const isDemoUser = (email: string | undefined): boolean => {
  return email === DEMO_EMAIL;
};
