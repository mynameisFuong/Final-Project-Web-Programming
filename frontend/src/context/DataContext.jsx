import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import {
  getRooms,
  createRoom as apiCreateRoom,
  updateRoom as apiUpdateRoom,
  deleteRoom as apiDeleteRoom,
  getDevices,
  createDevice as apiCreateDevice,
  updateDevice as apiUpdateDevice,
  deleteDevice as apiDeleteDevice,
  updateDeviceStatus as apiUpdateDeviceStatus,
  getRepairs,
  createRepair as apiCreateRepair,
  getReports,
  createReport as apiCreateReport,
  getAccounts,
  createAccount as apiCreateAccount,
  updateAccount as apiUpdateAccount,
  toggleAccountLock as apiToggleAccountLock
} from '../services/api.js';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [devices, setDevices] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [reports, setReports] = useState([]);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    if (!user) {
      setRooms([]);
      setDevices([]);
      setRepairs([]);
      setReports([]);
      setAccounts([]);
      return;
    }

    const load = async () => {
      try {
        console.log('📊 Đang tải dữ liệu...');
        const [roomData, deviceData, repairData, reportData] = await Promise.all([
          getRooms(),
          getDevices(),
          getRepairs(),
          getReports()
        ]);
        console.log('✓ Phòng:', roomData.length);
        console.log('✓ Thiết bị:', deviceData.length);
        console.log('✓ Sửa chữa:', repairData.length);
        console.log('✓ Báo cáo:', reportData.length);
        setRooms(roomData);
        // Normalize device keys from API (snake_case) to frontend expected camelCase
        const normDevices = deviceData.map((d) => ({
          ...d,
          roomId: d.room_id ?? d.roomId,
          imported: d.imported_date ?? d.imported
        }));
        setDevices(normDevices);
        setRepairs(repairData);
        setReports(reportData);
        if (user.role === 'ADMIN') {
          const accountData = await getAccounts();
          console.log('✓ Tài khoản:', accountData.length);
          setAccounts(accountData);
        }
      } catch (err) {
        console.error('❌ Lỗi tải dữ liệu:', err.message);
        console.error('Chi tiết:', err);
      }
    };

    load();
  }, [user]);

  const addRoom = async (room) => {
    const data = await apiCreateRoom(room);
    setRooms((prev) => [...prev, data]);
    return data;
  };

  const updateRoom = async (room) => {
    const data = await apiUpdateRoom(room.id, room);
    setRooms((prev) => prev.map((item) => (item.id === data.id ? data : item)));
    return data;
  };

  const deleteRoom = async (id) => {
    await apiDeleteRoom(id);
    setRooms((prev) => prev.filter((item) => item.id !== id));
    setDevices((prev) => prev.filter((device) => device.roomId !== id));
  };

  const addDevice = async (device) => {
    const payload = {
      code: device.code,
      name: device.name,
      type: device.type,
      status: device.status,
      imported_date: device.imported,
      description: device.description,
      room_id: device.roomId
    };
    const data = await apiCreateDevice(payload);
    const mapped = { ...data, roomId: data.room_id ?? data.roomId, imported: data.imported_date ?? data.imported };
    setDevices((prev) => [...prev, mapped]);
    return data;
  };

  const updateDevice = async (device) => {
    const payload = {
      code: device.code,
      name: device.name,
      type: device.type,
      status: device.status,
      imported_date: device.imported,
      description: device.description,
      room_id: device.roomId
    };
    const data = await apiUpdateDevice(device.id, payload);
    const mapped = { ...data, roomId: data.room_id ?? data.roomId, imported: data.imported_date ?? data.imported };
    setDevices((prev) => prev.map((item) => (item.id === mapped.id ? mapped : item)));
    return mapped;
  };

  const deleteDevice = async (id) => {
    await apiDeleteDevice(id);
    setDevices((prev) => prev.filter((item) => item.id !== id));
  };

  const updateDeviceStatus = async (id, status) => {
    const data = await apiUpdateDeviceStatus(id, status);
    const mapped = { ...data, roomId: data.room_id ?? data.roomId, imported: data.imported_date ?? data.imported };
    setDevices((prev) => prev.map((item) => (item.id === mapped.id ? mapped : item)));
    return mapped;
  };

  const addRepair = async (repair) => {
    const payload = {
      device_id: Number(repair.deviceId),
      note: repair.note
    };
    const data = await apiCreateRepair(payload);
    setRepairs((prev) => [data, ...prev]);
    return data;
  };

  const addReport = async (report) => {
    const payload = {
      device_id: Number(report.deviceId),
      description: report.description
    };
    const data = await apiCreateReport(payload);
    setReports((prev) => [data, ...prev]);
    return data;
  };

  const addAccount = async (account) => {
    const data = await apiCreateAccount(account);
    setAccounts((prev) => [...prev, data]);
    return data;
  };

  const updateAccount = async (account) => {
    const data = await apiUpdateAccount(account.id, account);
    setAccounts((prev) => prev.map((item) => (item.id === data.id ? data : item)));
    return data;
  };

  const toggleAccountLock = async (id) => {
    const data = await apiToggleAccountLock(id);
    setAccounts((prev) => prev.map((item) => (item.id === data.id ? data : item)));
    return data;
  };

  const summary = useMemo(() => {
    const good = devices.filter((item) => item.status === 'Tốt').length;
    const broken = devices.filter((item) => item.status === 'Hỏng').length;
    const repairing = devices.filter((item) => item.status === 'Đang sửa chữa').length;
    return {
      totalRooms: rooms.length,
      totalDevices: devices.length,
      good,
      broken,
      repairing,
      totalRepairs: repairs.length,
      totalAccounts: accounts.length
    };
  }, [rooms, devices, repairs, accounts]);

  return (
    <DataContext.Provider
      value={{
        rooms,
        devices,
        repairs,
        reports,
        accounts,
        summary,
        addRoom,
        updateRoom,
        deleteRoom,
        addDevice,
        updateDevice,
        deleteDevice,
        updateDeviceStatus,
        addRepair,
        addReport,
        addAccount,
        updateAccount,
        toggleAccountLock
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
