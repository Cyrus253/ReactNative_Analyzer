import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { FlatList,Alert,RefreshControl, Image, Text, TouchableOpacity, View } from 'react-native'
import { SignOutButton } from '@/components/SignOutButton'
import { useTransaction } from '../../hooks/useTransaction'
import { useEffect, useState } from 'react'
import Pageloader from '../../components/Pageloader'
import { styles } from '../../assets/styles/home.styles'
import { Ionicons } from '@expo/vector-icons'
import { BalanceCard } from '../../components/BalanceCard'
import {TransactionItem} from "../../components/TransactionItem"
import NoTransactionsFound from "../../components/NoTransactionsFound"

export default function Page() {
  const { user, isLoaded, isSignedIn } = useUser();  
  const router = useRouter()

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () =>{
    setRefreshing(true)
    await loadData()
    setRefreshing(false)

  }

  const { transactions,
        summary,
        loading,
        loadData,
        deleteTransaction } = useTransaction(user?.id);

  useEffect(() => {
    // Load data once user is available
    if (user?.id) {
      loadData()
    }
  }, [loadData, user?.id]);

const handleDelete = (id) =>{
   Alert.alert("Delete Transaction", "Are you sure you want to delete this transaction?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteTransaction(id) },
    ]);
}

  if(loading && !refreshing) return <Pageloader />
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* header component ui */}
      <View style={styles.header}>
        {/* left side  */}
        <View style ={styles.headerLeft}>
          <Image 
          source={require("../../assets/images/logo.png")}
          style={styles.headerLogo}
          resizeMode='contain'
        />
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.usernameText}>
              {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
            </Text>
        </View>
        </View>
        {/* right side */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
              <Ionicons name="add" size={20} color='#FFF' />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
      </View>
     <BalanceCard  summary={summary}/>
       <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
      </View>

       {/* FlatList is a performant way to render long lists in React Native. */}
      {/* it renders items lazily — only those on the screen. */}
      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({ item }) => <TransactionItem item={item} onDelete={handleDelete} />}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  )
}