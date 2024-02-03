import { BRANCH, INSTITUTIONS, SEMESTER, SUBJECT } from "@/constants/constants";
import TextInput from "./TextInput";
import SelectComponent from "./Select";
import AsyncCreatableSelectComponent from "./AsyncCreatableSelect";

export default function InstitutionalExamMetadata({
  control,
}: {
  control: any;
}) {
  // ------------ For future reference -------------------

  // const [institutions, setInstitutions] = useState<ICreatableData[]>([]);

  // useEffect(() => {
  //   const getCreatableData = async () => {
  //     const getDataFromCachePromises = [
  //       getInitalValuesFromCache({
  //         setName: REDIS_COLLECTION_NAME.INSTITUTIONS,
  //         lowerLimit: 0,
  //         upperLimit: 10,
  //       }),
  //     ];

  //     const [institutionInfoRes] = await Promise.all(getDataFromCachePromises);

  //     if (institutionInfoRes.hasError === true) {
  //       console.error(institutionInfoRes.message);
  //     } else setInstitutions(institutionInfoRes.values as ICreatableData[]);
  //   };
  //   getCreatableData();
  // }, []);

  // console.log("institutions", institutions);

  // -------------------------------------------------------

  return (
    <>
      <AsyncCreatableSelectComponent
        control={control}
        name="institution"
        id="institution"
        placeholder="Select Institution"
        label="Institution Name"
        options={INSTITUTIONS}
      />
      <TextInput
        control={control}
        name="year"
        id="year"
        label="Year of Examination"
        placeholder={`${new Date().getFullYear()}`}
      />
      <SelectComponent
        control={control}
        name="semester"
        label="Semester"
        id="semester"
        placeholder="Select Semester"
        options={SEMESTER}
      />
      <AsyncCreatableSelectComponent
        control={control}
        name="branch"
        id="branch"
        placeholder="Select Branch"
        label="Branch"
        options={BRANCH}
      />
      <TextInput
        control={control}
        name="subjectCode"
        id="subject_code"
        label="Subject Code"
        placeholder="Subject Code"
      />
      <AsyncCreatableSelectComponent
        control={control}
        name="subjectName"
        id="subject_name"
        placeholder="Select Subject Name"
        label="Subject Name"
        options={SUBJECT}
      />
      <TextInput
        control={control}
        name="tags"
        id="tags"
        label="Tags (comma seperated)"
        placeholder="Comma seperated tags"
      />
    </>
  );
}
