// app/_layout.tsx
// import { Slot, SplashScreen } from 'expo-router';
// import { useSegments, useRouter } from 'expo-router';
// import { onAuthStateChanged } from 'firebase/auth';
// import React, { useEffect, useState } from 'react';
// import { auth } from '../firebaseConfig';

// SplashScreen.preventAutoHideAsync();

// const RootLayout = () => {
//   const segments = useSegments();
//   const router = useRouter();
//   const [isAuth, setIsAuth] = useState(false);
//   const [isReady, setIsReady] = useState(false);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setIsAuth(!!user);
//       setIsReady(true);
//       SplashScreen.hideAsync();
//     });
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (!isReady) return;
//     const inAuthGroup = segments[0] === '(auth)';

//     if (isAuth && inAuthGroup) {
//       router.replace('/(tabs)/home');
//     } else if (!isAuth && !inAuthGroup) {
//       router.replace('/(auth)/signin');
//     }
//   }, [isAuth, isReady, segments]);

//   // Make sure nothing is returned before or after this line
//   return <Slot />;
// };

// export default RootLayout;
// app/_layout.tsx
import { Slot, SplashScreen } from 'expo-router';
import { useSegments, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const segments = useSegments();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuth(!!user);
      setIsReady(true);
      SplashScreen.hideAsync();
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const inAuthGroup = segments[0] === '(auth)';

    if (isAuth && inAuthGroup) {
      // User is authenticated, redirect them away from the auth pages
      router.replace('/(tabs)/home');
    } else if (!isAuth && !inAuthGroup) {
      // User is not authenticated, redirect them to the signin page
      router.replace('/');
    }
  }, [isAuth, isReady, segments]);

  return <Slot />;
};

export default RootLayout;