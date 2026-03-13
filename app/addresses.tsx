import Header from "@/components/header";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Cells, Districts, Provinces, Sectors, Villages } from "rwanda";

type FieldKey = "province" | "district" | "sector" | "cell" | "village";

type SelectFieldProps = {
  fieldKey: FieldKey;
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  disabled?: boolean;
  openField: FieldKey | null;
  setOpenField: (value: FieldKey | null) => void;
  onSelect: (value: string) => void;
};

function SelectField({
  fieldKey,
  label,
  value,
  placeholder,
  options,
  disabled,
  openField,
  setOpenField,
  onSelect,
}: SelectFieldProps) {
  const isOpen = openField === fieldKey;

  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-semibold text-gray-700">{label}</Text>
      <TouchableOpacity
        disabled={disabled}
        onPress={() => setOpenField(isOpen ? null : fieldKey)}
        className={`rounded-xl border px-4 py-3 flex-row items-center justify-between ${
          disabled ? "border-gray-200 bg-gray-100" : "border-gray-300 bg-white"
        }`}
      >
        <Text className={value ? "text-gray-900" : "text-gray-400"}>
          {value || placeholder}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={18}
          color={disabled ? "#9ca3af" : "#374151"}
        />
      </TouchableOpacity>

      {isOpen && !disabled && (
        <View className="mt-2 rounded-xl border border-gray-200 bg-white overflow-hidden">
          {options.length === 0 ? (
            <Text className="px-4 py-3 text-gray-500">
              No options available
            </Text>
          ) : (
            <ScrollView nestedScrollEnabled className="max-h-52">
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => {
                    onSelect(option);
                    setOpenField(null);
                  }}
                  className="px-4 py-3 border-b border-gray-100"
                >
                  <Text className="text-gray-900">{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

export default function Addresses() {
  const [addressForm, setAddressForm] = useState<boolean>(false);
  const [openField, setOpenField] = useState<FieldKey | null>(null);
  const [recipientName, setRecipientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedCell, setSelectedCell] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (isMounted) {
        const loggedIn = typeof token === "string" && token.length > 0;
        setIsLoggedIn(loggedIn);
        if (!loggedIn) {
          setIsDefaultAddress(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const provinces: string[] = Provinces();

  const districts: string[] = useMemo(() => {
    if (!selectedProvince) return [];
    return Districts({ provinces: selectedProvince as any }) ?? [];
  }, [selectedProvince]);

  const sectors: string[] = useMemo(() => {
    if (!selectedProvince || !selectedDistrict) return [];

    const candidateSectors =
      Sectors({
        province: selectedProvince as any,
        district: selectedDistrict as any,
      }) ?? [];

    // Filter out sectors not linked to the selected district.
    return candidateSectors.filter((sector: any) => {
      const linkedCells =
        Cells({
          province: selectedProvince as any,
          district: selectedDistrict as any,
          sector,
        }) ?? [];
      return linkedCells.length > 0;
    });
  }, [selectedProvince, selectedDistrict]);

  const cells: string[] = useMemo(() => {
    if (!selectedProvince || !selectedDistrict || !selectedSector) return [];
    return (
      Cells({
        province: selectedProvince as any,
        district: selectedDistrict as any,
        sector: selectedSector as any,
      }) ?? []
    );
  }, [selectedProvince, selectedDistrict, selectedSector]);

  const villages: string[] = useMemo(() => {
    if (
      !selectedProvince ||
      !selectedDistrict ||
      !selectedSector ||
      !selectedCell
    )
      return [];
    return (
      Villages({
        province: selectedProvince as any,
        district: selectedDistrict as any,
        sector: selectedSector as any,
        cell: selectedCell as any,
      }) ?? []
    );
  }, [selectedProvince, selectedDistrict, selectedSector, selectedCell]);

  const isFormValid =
    recipientName.trim().length > 0 &&
    phoneNumber.trim().length > 0 &&
    selectedProvince.length > 0 &&
    selectedDistrict.length > 0 &&
    selectedSector.length > 0 &&
    selectedCell.length > 0 &&
    selectedVillage.length > 0;

  const resetForm = () => {
    setRecipientName("");
    setPhoneNumber("");
    setAdditionalDetails("");
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedSector("");
    setSelectedCell("");
    setSelectedVillage("");
    setIsDefaultAddress(false);
    setOpenField(null);
    setAddressForm(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-surafce" edges={["top"]}>
      <Header title="Shipping Addresses" showBackButton />
      <ScrollView className="px-4 mt-4 flex-1">
        <Text className="text-gray-500 mb-4">No addresses found</Text>
        <TouchableOpacity
          onPress={() => setAddressForm(true)}
          className="border-dashed border-2 border-gray-300 rounded-md p-6 mb-6 bg-white items-center justify-center"
        >
          <Text className="font-bold items-center justify-center text-gray-700">
            <Ionicons name="add" size={20} /> Add New Address
          </Text>
        </TouchableOpacity>

        {addressForm && (
          <View className="bg-white rounded-2xl p-4 border border-gray-200 mb-8">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              New Shipping Address
            </Text>

            <SelectField
              fieldKey="province"
              label="Province"
              value={selectedProvince}
              placeholder="Choose province"
              options={provinces}
              openField={openField}
              setOpenField={setOpenField}
              onSelect={(value) => {
                setSelectedProvince(value);
                setSelectedDistrict("");
                setSelectedSector("");
                setSelectedCell("");
                setSelectedVillage("");
              }}
            />

            <SelectField
              fieldKey="district"
              label="District"
              value={selectedDistrict}
              placeholder="Choose district"
              options={districts}
              disabled={!selectedProvince}
              openField={openField}
              setOpenField={setOpenField}
              onSelect={(value) => {
                setSelectedDistrict(value);
                setSelectedSector("");
                setSelectedCell("");
                setSelectedVillage("");
              }}
            />

            <SelectField
              fieldKey="sector"
              label="Sector"
              value={selectedSector}
              placeholder="Choose sector"
              options={sectors}
              disabled={!selectedDistrict}
              openField={openField}
              setOpenField={setOpenField}
              onSelect={(value) => {
                setSelectedSector(value);
                setSelectedCell("");
                setSelectedVillage("");
              }}
            />

            <SelectField
              fieldKey="cell"
              label="Cell"
              value={selectedCell}
              placeholder="Choose cell"
              options={cells}
              disabled={!selectedSector}
              openField={openField}
              setOpenField={setOpenField}
              onSelect={(value) => {
                setSelectedCell(value);
                setSelectedVillage("");
              }}
            />

            <SelectField
              fieldKey="village"
              label="Village"
              value={selectedVillage}
              placeholder="Choose village"
              options={villages}
              disabled={!selectedCell}
              openField={openField}
              setOpenField={setOpenField}
              onSelect={setSelectedVillage}
            />
            <Text className="mb-2">Additional Note</Text>
            <TextInput
              value={additionalDetails}
              onChangeText={setAdditionalDetails}
              multiline
              numberOfLines={3}
              className="mb-4 border rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900"
              placeholder="any addional note"
            />

            {isLoggedIn && (
              <TouchableOpacity
                onPress={() => setIsDefaultAddress((prev) => !prev)}
                className="flex-row items-center mb-4"
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isDefaultAddress ? "checkbox" : "square-outline"}
                  size={22}
                  color={isDefaultAddress ? "#907764" : "#6b7280"}
                />
                <Text className="ml-2 text-gray-700 font-medium">
                  Make this my default address
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
