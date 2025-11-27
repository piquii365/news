import React, { useState } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Platform,
  useWindowDimensions,
  Animated,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/scripts/themed-view";
import { Image } from "expo-image";

export default function TopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const [open, setOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const isSmall = width < 700;

  const navItems = [
    { name: "Culture", href: "/culture" },
    { name: "Politics", href: "/politics" },
    { name: "Memes", href: "/memes" },
    { name: "Sports", href: "/sports" },
    { name: "Boxed", href: "/boxed" },
    { name: "Reviews", href: "/reviews" },
  ];

  const isActive = (path) =>
    pathname === path || pathname.startsWith(path + "/");

  const NavLink = ({ onPress, label, path, style }) => {
    const active = isActive(path);
    const hovered = hoveredLink === path;

    return (
      <Pressable
        onPress={onPress}
        onHoverIn={() => setHoveredLink(path)}
        onHoverOut={() => setHoveredLink(null)}
        style={[
          styles.link,
          active && styles.linkActive,
          hovered && styles.linkHovered,
          style,
        ]}
      >
        <ThemedText
          type="defaultSemiBold"
          style={[styles.linkText, active && styles.linkTextActive]}
        >
          {label}
        </ThemedText>
        {active && <View style={styles.activeIndicator} />}
      </Pressable>
    );
  };

  return (
    <>
      <ThemedView style={styles.container}>
        <View style={styles.inner}>
          {Platform.OS === "web" ? (
            <Pressable
              onPress={() => router.push("/")}
              style={styles.logoWrap}
              onHoverIn={() => setHoveredLink("logo")}
              onHoverOut={() => setHoveredLink(null)}
            >
              <Image
                source={require("@/assets/images/logo.png")}
                style={[
                  styles.logo,
                  hoveredLink === "logo" && styles.logoHovered,
                ]}
              />
            </Pressable>
          ) : null}

          {Platform.OS === "web" && !isSmall ? (
            <View style={styles.links}>
              <NavLink onPress={() => router.push("/")} label="Home" path="/" />
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  onPress={() => router.push(item.href)}
                  label={item.name}
                  path={item.href}
                />
              ))}
            </View>
          ) : (
            <Pressable
              onPress={() => setOpen((s) => !s)}
              style={styles.hamburger}
            >
              <ThemedText type="defaultSemiBold" style={styles.hamburgerIcon}>
                {open ? "✕" : "☰"}
              </ThemedText>
            </Pressable>
          )}
        </View>
      </ThemedView>

      {isSmall && open && (
        <>
          <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
          <ThemedView style={styles.mobileMenu}>
            <Pressable
              onPress={() => {
                setOpen(false);
                router.push("/");
              }}
              style={[
                styles.mobileLink,
                isActive("/") && styles.mobileLinkActive,
              ]}
            >
              <ThemedText style={isActive("/") && styles.mobileLinkTextActive}>
                Home
              </ThemedText>
            </Pressable>
            {navItems.map((item) => (
              <Pressable
                key={item.href}
                onPress={() => {
                  setOpen(false);
                  router.push(item.href);
                }}
                style={[
                  styles.mobileLink,
                  isActive(item.href) && styles.mobileLinkActive,
                ]}
              >
                <ThemedText
                  style={isActive(item.href) && styles.mobileLinkTextActive}
                >
                  {item.name}
                </ThemedText>
              </Pressable>
            ))}
            <Pressable
              onPress={() => {
                setOpen(false);
                router.push("/memes");
              }}
              style={[
                styles.mobileLink,
                isActive("/memes") && styles.mobileLinkActive,
              ]}
            >
              <ThemedText
                style={isActive("/memes") && styles.mobileLinkTextActive}
              >
                Memes
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={() => {
                setOpen(false);
                router.push("/boxed");
              }}
              style={[
                styles.mobileLink,
                isActive("/boxed") && styles.mobileLinkActive,
              ]}
            >
              <ThemedText
                style={isActive("/boxed") && styles.mobileLinkTextActive}
              >
                Boxed
              </ThemedText>
            </Pressable>
          </ThemedView>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inner: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  link: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    position: "relative",
    transition: "all 0.2s ease",
  },
  linkHovered: {
    backgroundColor: "#f3f4f6",
  },
  linkActive: {
    backgroundColor: "#f0f9ff",
  },
  linkText: {
    fontSize: 14,
    color: "#374151",
  },
  linkTextActive: {
    color: "#2563eb",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: 12,
    right: 12,
    height: 2,
    backgroundColor: "#2563eb",
    borderRadius: 1,
  },
  links: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    flex: 1,
  },
  logo: {
    width: 120,
    height: 80,
    resizeMode: "contain",
    transition: "transform 0.2s ease",
  },
  logoHovered: {
    transform: [{ scale: 1.05 }],
  },
  logoWrap: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 4,
    paddingRight: 8,
  },
  hamburger: {
    marginLeft: "auto",
    padding: 8,
    borderRadius: 6,
  },
  hamburgerIcon: {
    fontSize: 24,
    color: "#374151",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 998,
  },
  mobileMenu: {
    position: "absolute",
    top: 73,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 999,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  mobileLink: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  mobileLinkActive: {
    backgroundColor: "#f0f9ff",
  },
  mobileLinkTextActive: {
    color: "#2563eb",
    fontWeight: "600",
  },
});
