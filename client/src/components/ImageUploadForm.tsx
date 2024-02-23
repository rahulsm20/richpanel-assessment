import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "./Input";

interface ImageData {
  file: File | undefined;
  title: string;
  description: string;
}

const ImageUploadForm = () => {
  const [imageData, setImageData] = useState<ImageData>({
    file: undefined,
    title: "",
    description: "",
  });
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(imageData);
    try {
      // await uploadImage(imageData);
      navigate("/view-images");
    } catch (err) {
      setError(true);
      console.log(err);
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    const newValue = name === "file" ? (files ? files[0] : undefined) : value;
    setImageData({ ...imageData, [name]: newValue });
  };

  return (
    <form
      className="flex flex-col gap-5 justify-center items-center"
      onSubmit={onSubmit}
    >
      <p className="text-2xl">Upload Image</p>
      <Input
        name="file"
        type="file"
        accept="image/*"
        onChange={onChange}
      ></Input>
      <Input name="title" type="text" onChange={onChange}></Input>
      <Input name="description" type="text" onChange={onChange}></Input>
      <button className="btn btn-primary text-white" type="submit">
        Submit
      </button>
      {error && <span className="text-red-500">Failed to upload image</span>}
    </form>
  );
};

export default ImageUploadForm;
