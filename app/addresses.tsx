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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [formData, setFormData] = useState({
    recipientName: "",
    phoneNumber: "",
    additionalDetails: "",
    province: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
    isDefaultAddress: false,
  });

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (isMounted) {
        const loggedIn = typeof token === "string" && token.length > 0;
        setIsLoggedIn(loggedIn);
        if (!loggedIn) {
          setFormData((prev) => ({ ...prev, isDefaultAddress: false }));
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
    if (!formData.province) return [];
    return Districts({ provinces: formData.province as any }) ?? [];
  }, [formData.province]);

  const sectors: string[] = useMemo(() => {
    if (!formData.province || !formData.district) return [];

    const candidateSectors =
      Sectors({
        province: formData.province as any,
        district: formData.district as any,
      }) ?? [];

    return candidateSectors.filter((sector: any) => {
      const linkedCells =
        Cells({
          province: formData.province as any,
          district: formData.district as any,
          sector,
        }) ?? [];
      return linkedCells.length > 0;
    });
  }, [formData.province, formData.district]);

  const cells: string[] = useMemo(() => {
    if (!formData.province || !formData.district || !formData.sector) return [];
    return (
      Cells({
        province: formData.province as any,
        district: formData.district as any,
        sector: formData.sector as any,
      }) ?? []
    );
  }, [formData.province, formData.district, formData.sector]);

  const villages: string[] = useMemo(() => {
    if (
      !formData.province ||
      !formData.district ||
      !formData.sector ||
      !formData.cell
    )
      return [];
    return (
      Villages({
        province: formData.province as any,
        district: formData.district as any,
        sector: formData.sector as any,
        cell: formData.cell as any,
      }) ?? []
    );
  }, [formData.province, formData.district, formData.sector, formData.cell]);

  const isFormValid =
    formData.recipientName.trim().length > 0 &&
    formData.phoneNumber.trim().length > 0 &&
    formData.province.length > 0 &&
    formData.district.length > 0 &&
    formData.sector.length > 0 &&
    formData.cell.length > 0 &&
    formData.village.length > 0;

  const resetForm = () => {
    setFormData({
      recipientName: "",
      phoneNumber: "",
      additionalDetails: "",
      province: "",
      district: "",
      sector: "",
      cell: "",
      village: "",
      isDefaultAddress: false,
    });
    setOpenField(null);
    setAddressForm(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
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
            {!isLoggedIn && (
              <View>
                <Text className="mb-2">Names</Text>
                <TextInput
                  placeholder="full names.."
                  className="mb-4 border rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900"
                />
                <Text className="mb-2">Email</Text>
                <TextInput
                  placeholder="example@gmail.com.."
                  className="mb-4 border rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900"
                />
                <Text className="mb-2">Phone Number</Text>
                <TextInput
                  placeholder="+25078XXXXXXX"
                  className="mb-4 border rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900"
                />
              </View>
            )}

            <SelectField
              fieldKey="province"
              label="Province"
              value={formData.province}
              placeholder="Choose province"
              options={provinces}
              openField={openField}
              setOpenField={setOpenField}
              onSelect={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  province: value,
                  district: "",
                  sector: "",
                  cell: "",
                  village: "",
                }));
              }}
            />

            <SelectField
              fieldKey="district"
              label="District"
              value={formData.district}
              placeholder="Choose district"
              options={districts}
              disabled={!formData.province}
              openField={openField}
              setOpenField={setOpenField}
              onSelect={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  district: value,
                  sector: "",
                  cell: "",
                  village: "",
                }));
              }}
            />

            <SelectField
              fieldKey="sector"
              label="Sector"
              value={formData.sector}
              placeholder="Choose sector"
              options={sectors}
              disabled={!formData.district}
              openField={openField}
              setOpenField={setOpenField}
              onSelect={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  sector: value,
                  cell: "",
                  village: "",
                }));
              }}
            />

            <SelectField
              fieldKey="cell"
              label="Cell"
              value={formData.cell}
              placeholder="Choose cell"
              options={cells}
              disabled={!formData.sector}
              openField={openField}
              setOpenField={setOpenField}
              onSelect={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  cell: value,
                  village: "",
                }));
              }}
            />

            <SelectField
              fieldKey="village"
              label="Village"
              value={formData.village}
              placeholder="Choose village"
              options={villages}
              disabled={!formData.cell}
              openField={openField}
              setOpenField={setOpenField}
              onSelect={(value) =>
                setFormData((prev) => ({ ...prev, village: value }))
              }
            />
            <Text className="mb-2">Additional Note</Text>
            <TextInput
              value={formData.additionalDetails}
              onChangeText={(v) =>
                setFormData((prev) => ({ ...prev, additionalDetails: v }))
              }
              multiline
              numberOfLines={5}
              className="mb-4 border rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900"
              placeholder="any addional note"
            />

            {isLoggedIn && (
              <TouchableOpacity
                onPress={() =>
                  setFormData((prev) => ({
                    ...prev,
                    isDefaultAddress: !prev.isDefaultAddress,
                  }))
                }
                className="flex-row items-center mb-4"
                activeOpacity={0.8}
              >
                <Ionicons
                  name={
                    formData.isDefaultAddress ? "checkbox" : "square-outline"
                  }
                  size={22}
                  color={formData.isDefaultAddress ? "#907764" : "#6b7280"}
                />
                <Text className="ml-2 text-gray-700 font-medium">
                  Make this my default address
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity className="bg-primary items-center py-3 rounded-full">
              <Text className="font-semibold text-base">Continue</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
