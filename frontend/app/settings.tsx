// SpendWise Premium - Settings Screen

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/hooks/useTheme';
import { useStore } from '../src/store/useStore';
import { Card } from '../src/components/Card';
import { t } from '../src/constants/translations';
import { Spacing, Typography, BorderRadius } from '../src/constants/theme';
import axios from 'axios';
import * as Haptics from 'expo-haptics';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

export default function SettingsScreen() {
  const { colors, isDark, theme, themePreference } = useTheme();
  const router = useRouter();
  const { user, logout, setTheme, updateUserSettings, isGuestMode } = useStore();
  
  const [budgetAlerts, setBudgetAlerts] = useState(user?.settings?.budget_alerts ?? true);
  
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    updateUserSettings({ theme: newTheme });
    Haptics.selectionAsync();
  };
  
  const handleBudgetAlertsToggle = (value: boolean) => {
    setBudgetAlerts(value);
    updateUserSettings({ budget_alerts: value });
    Haptics.selectionAsync();
  };
  
  const handleExportData = async () => {
    if (!user?.id) return;
    
    try {
      const response = await axios.get(`${BACKEND_URL}/api/users/${user.id}/export`);
      Alert.alert(
        'Export reușit',
        'Datele tale au fost pregătite pentru export. În viitor, vei putea descărca un fișier.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Eroare', 'Nu s-au putut exporta datele');
    }
  };
  
  const handleDeleteAccount = () => {
    Alert.alert(
      t.auth.deleteAccount,
      t.settings.confirmDeleteAll,
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.common.delete,
          style: 'destructive',
          onPress: async () => {
            try {
              if (user?.id) {
                await axios.delete(`${BACKEND_URL}/api/users/${user.id}`);
              }
              logout();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Eroare', 'Nu s-a putut șterge contul');
            }
          },
        },
      ]
    );
  };
  
  const handleLogout = () => {
    Alert.alert(
      t.auth.signOut,
      'Ești sigur că vrei să te deconectezi?',
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.auth.signOut,
          onPress: () => {
            logout();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };
  
  const renderSettingItem = (
    icon: string,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightElement?: React.ReactNode,
    danger?: boolean
  ) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress && !rightElement}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[
        styles.settingIconContainer,
        { backgroundColor: danger ? colors.errorLight : colors.primary + '15' },
      ]}>
        <Ionicons
          name={icon as any}
          size={20}
          color={danger ? colors.error : colors.primary}
        />
      </View>
      <View style={styles.settingContent}>
        <Text style={[
          styles.settingTitle,
          { color: danger ? colors.error : colors.text },
        ]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement || (
        onPress && <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
      )}
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.screenTitle, { color: colors.text }]}>
            {t.settings.title}
          </Text>
        </View>
        
        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileContent}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>
                {(user?.display_name?.[0] || 'I').toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.text }]}>
                {user?.display_name || 'Invitat'}
              </Text>
              <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                {user?.email || (isGuestMode ? 'Mod invitat' : 'Nu este conectat')}
              </Text>
            </View>
          </View>
          {isGuestMode && (
            <View style={[styles.guestBadge, { backgroundColor: colors.warningLight }]}>
              <Ionicons name="information-circle" size={16} color={colors.warning} />
              <Text style={[styles.guestBadgeText, { color: colors.warning }]}>
                {t.auth.guestModeInfo}
              </Text>
            </View>
          )}
        </Card>
        
        {/* Appearance */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t.settings.appearance}
        </Text>
        <Card style={styles.sectionCard}>
          <Text style={[styles.themeLabel, { color: colors.text }]}>{t.settings.theme}</Text>
          <View style={styles.themeOptions}>
            {[
              { id: 'light', icon: 'sunny', label: t.settings.light },
              { id: 'dark', icon: 'moon', label: t.settings.dark },
              { id: 'system', icon: 'phone-portrait', label: t.settings.system },
            ].map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.themeOption,
                  { borderColor: colors.border },
                  themePreference === option.id && {
                    borderColor: colors.primary,
                    backgroundColor: colors.primary + '10',
                  },
                ]}
                onPress={() => handleThemeChange(option.id as any)}
              >
                <Ionicons
                  name={option.icon as any}
                  size={24}
                  color={themePreference === option.id ? colors.primary : colors.textSecondary}
                />
                <Text style={[
                  styles.themeOptionText,
                  { color: themePreference === option.id ? colors.primary : colors.text },
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
        
        {/* Notifications */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t.settings.notifications}
        </Text>
        <Card style={styles.sectionCard}>
          {renderSettingItem(
            'notifications',
            t.settings.budgetAlerts,
            'Primește notificări când atingi 70%, 90% și 100% din buget',
            undefined,
            <Switch
              value={budgetAlerts}
              onValueChange={handleBudgetAlertsToggle}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          )}
        </Card>
        
        {/* Data */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t.settings.data}
        </Text>
        <Card style={styles.sectionCard}>
          {renderSettingItem(
            'download',
            t.settings.exportData,
            'Descarcă toate datele tale',
            handleExportData
          )}
        </Card>
        
        {/* Account */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t.settings.account}
        </Text>
        <Card style={styles.sectionCard}>
          {renderSettingItem(
            'log-out',
            t.auth.signOut,
            undefined,
            handleLogout
          )}
          {renderSettingItem(
            'trash',
            t.auth.deleteAccount,
            'Șterge permanent contul și toate datele',
            handleDeleteAccount,
            undefined,
            true
          )}
        </Card>
        
        {/* About */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t.settings.about}
        </Text>
        <Card style={styles.sectionCard}>
          {renderSettingItem(
            'information-circle',
            t.settings.version,
            '1.0.0'
          )}
        </Card>
        
        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appName, { color: colors.textTertiary }]}>
            SpendWise Premium
          </Text>
          <Text style={[styles.appCopyright, { color: colors.textTertiary }]}>
            © 2025 SpendWise
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  screenTitle: {
    ...Typography.displaySmall,
  },
  profileCard: {
    marginBottom: Spacing.lg,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  profileInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  profileName: {
    ...Typography.headlineMedium,
  },
  profileEmail: {
    ...Typography.bodySmall,
    marginTop: 2,
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  guestBadgeText: {
    ...Typography.bodySmall,
    flex: 1,
  },
  sectionTitle: {
    ...Typography.labelMedium,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.sm,
    textTransform: 'uppercase',
  },
  sectionCard: {
    marginBottom: Spacing.lg,
    padding: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  settingTitle: {
    ...Typography.bodyMedium,
    fontWeight: '500',
  },
  settingSubtitle: {
    ...Typography.bodySmall,
    marginTop: 2,
  },
  themeLabel: {
    ...Typography.labelMedium,
    padding: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  themeOptions: {
    flexDirection: 'row',
    padding: Spacing.md,
    paddingTop: 0,
    gap: Spacing.sm,
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
  },
  themeOptionText: {
    ...Typography.labelSmall,
    marginTop: Spacing.sm,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  appName: {
    ...Typography.labelMedium,
  },
  appCopyright: {
    ...Typography.labelSmall,
    marginTop: 4,
  },
});
