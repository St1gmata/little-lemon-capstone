import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const menuItems = [
  {
    id: "1",
    name: "Greek Salad",
    description: "Crispy lettuce, peppers, olives and feta.",
    price: "$12.99",
    image: "https://picsum.photos/100?1"
  },
  {
    id: "2",
    name: "Bruschetta",
    description: "Grilled bread with garlic and tomatoes.",
    price: "$7.99",
    image: "https://picsum.photos/100?2"
  },
  {
    id: "3",
    name: "Lemon Dessert",
    description: "Sweet and sour traditional dessert.",
    price: "$5.99",
    image: "https://picsum.photos/100?3"
  },
  {
    id: "4",
    name: "Pasta",
    description: "Classic pasta with rich tomato sauce.",
    price: "$10.99",
    image: "https://picsum.photos/100?4"
  }
];

function OnboardingScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const register = async () => {
    await AsyncStorage.setItem("firstName", firstName);
    await AsyncStorage.setItem("lastName", lastName);
    await AsyncStorage.setItem("email", email);
    await AsyncStorage.setItem("isLoggedIn", "true");
    navigation.replace("Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>LITTLE LEMON</Text>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Let's get to know you</Text>
      </View>

      <Text style={styles.sectionTitle}>Personal information</Text>
      <TextInput placeholder="First name" style={styles.input} value={firstName} onChangeText={setFirstName} />
      <TextInput placeholder="Last name" style={styles.input} value={lastName} onChangeText={setLastName} />
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />

      <TouchableOpacity style={styles.yellowButton} onPress={register}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

function HomeScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <View style={styles.menuItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDesc}>{item.description}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
      </View>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={
        <>
          <View style={styles.header}>
            <Text style={styles.logo}>LITTLE LEMON</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Text style={styles.profileIcon}>👤</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.hero}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>Little Lemon</Text>
              <Text style={styles.heroSub}>Chicago</Text>
              <Text style={styles.heroText}>
                We are a family owned Mediterranean restaurant, focused on traditional
                recipes served with a modern twist.
              </Text>
            </View>
            <Image source={{ uri: "https://picsum.photos/120?5" }} style={styles.heroImage} />
          </View>

          <TextInput placeholder="Enter search phrase" style={styles.search} />

          <Text style={styles.orderTitle}>ORDER FOR DELIVERY!</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            {["Starters", "Mains", "Desserts", "Drinks"].map((item) => (
              <View key={item} style={styles.categoryBtn}>
                <Text>{item}</Text>
              </View>
            ))}
          </ScrollView>
        </>
      }
      data={menuItems}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}

function ProfileScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setFirstName((await AsyncStorage.getItem("firstName")) || "");
      setLastName((await AsyncStorage.getItem("lastName")) || "");
      setEmail((await AsyncStorage.getItem("email")) || "");
    };
    loadData();
  }, []);

  const logout = async () => {
    await AsyncStorage.multiRemove(["firstName", "lastName", "email", "isLoggedIn"]);
    navigation.replace("Onboarding");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>LITTLE LEMON</Text>
      <Text style={styles.sectionTitle}>Personal information</Text>

      <TextInput style={styles.input} value={firstName} editable={false} />
      <TextInput style={styles.input} value={lastName} editable={false} />
      <TextInput style={styles.input} value={email} editable={false} />

      <TouchableOpacity style={styles.yellowButton} onPress={logout}>
        <Text style={styles.buttonText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      const loggedIn = await AsyncStorage.getItem("isLoggedIn");
      setInitialRoute(loggedIn === "true" ? "Home" : "Onboarding");
    };
    checkLogin();
  }, []);

  if (!initialRoute) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20
  },
  logo: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 20
  },
  banner: {
    backgroundColor: "#495E57",
    padding: 20,
    marginBottom: 20
  },
  bannerText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  },
  yellowButton: {
    backgroundColor: "#F4CE14",
    padding: 14,
    borderRadius: 8,
    marginTop: 20
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "700"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  profileIcon: {
    fontSize: 24
  },
  hero: {
    backgroundColor: "#495E57",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 12
  },
  heroTitle: {
    color: "#F4CE14",
    fontSize: 28,
    fontWeight: "700"
  },
  heroSub: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 8
  },
  heroText: {
    color: "#fff",
    paddingRight: 10
  },
  heroImage: {
    width: 100,
    height: 100,
    borderRadius: 8
  },
  search: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 14
  },
  orderTitle: {
    fontWeight: "800",
    marginBottom: 10
  },
  categoryBtn: {
    backgroundColor: "#EDEFEE",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 8
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd"
  },
  itemName: {
    fontSize: 18,
    fontWeight: "700"
  },
  itemDesc: {
    color: "#555",
    marginVertical: 6
  },
  itemPrice: {
    fontWeight: "600"
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginLeft: 10
  }
});
