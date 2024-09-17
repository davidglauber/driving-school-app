import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IUseGetStudentLocation } from "./useGetStudentLocation.interface";

const fetchStudentLocation = async (cep: string) => {
  const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
  return data;
};
export const useGetStudentLocation = ({ cep }: IUseGetStudentLocation) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["studentLocation"],
    queryFn: () => fetchStudentLocation(cep),
    enabled: cep?.length === 8,
  });
  return { data, error, isLoading };
};
