import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Dimensions 
} from 'react-native';
import { useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { ArrowRight } from 'lucide-react-native';

const { height } = Dimensions.get('window');

// Colors constant
const Colors = {
  PRIMARY: '#FFFFFF',
  GRAY: '#888888'
};

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

const SignInWithOAuth = () => {
  useWarmUpBrowser();
  
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  
  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/(tabs)/home', { scheme: 'myapp' }),
      });

      if (createdSessionId) {
        setActive?.({ session: createdSessionId });
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  }, []);

  return (
    <TouchableOpacity 
      style={styles.button}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>Continue</Text>
      <ArrowRight 
        size={20} 
        color="black"
        style={styles.arrowIcon}
      />
    </TouchableOpacity>
  );
};

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          source={require('../../assets/images/alien.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerSection}>
          <Text style={styles.titleText}>
            Welcome to AbstractAI
          </Text>
          <Text style={styles.subtitleText}>
            Begin your AI journey today
          </Text>
        </View>

        <View style={styles.buttonSection}>
          <SignInWithOAuth />
          <Text style={styles.termsText}>
            By continuing you agree to our Terms and Conditions
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  imageWrapper: {
    height: height * 0.55,
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: 600,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  contentContainer: {
    padding: 25,
    marginTop: -25,
    backgroundColor: '#000000',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: height * 0.45,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  headerSection: {
    marginBottom: 40,
  },
  titleText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitleText: {
    fontSize: 16,
    color: Colors.GRAY,
    textAlign: 'center',
    opacity: 0.9,
  },
  buttonSection: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 25,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    marginRight: 8,
  },
  arrowIcon: {
    marginLeft: 2,
  },
  termsText: {
    fontSize: 13,
    color: Colors.GRAY,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 18,
  },
});

export default LoginScreen;