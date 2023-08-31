import { Button } from '@chakra-ui/react'
import React, { FC, useCallback, useState } from 'react'
import { Firebase_User } from '../../src/interfaces/firebase_user.interface';
import { useDispatch, useSelector } from 'react-redux';
import ModalReausable from '../organisms/ModalReausable';
import LoginAndRegistrationForm from '../organisms/LoginAndRegistrationForm';
import { changeFavouriteShops } from '../../src/store/reducers/user';
import { useMutation } from '@apollo/client';
import UNFOLLOW from '../../src/lib/apollo/mutations/unfollow';
import GET_USER_FOLLOWINGS from '../../src/lib/apollo/queries/getUserFollowings';
import FOLLOW from '../../src/lib/apollo/mutations/follow';
import expirationTimeTokenControll from '../utils/expirationTimeTokenControll';

const ButtonFollow: FC<{ shopId: string | undefined | null }> = ({ shopId }) => {
    if (!shopId) {
        return (<>
        </>)
    }
    const user: Firebase_User = useSelector((state: any) => state.user.user);
    const [onFollowLoading, setOnFollowLoading] = useState(false)
    const [isOpenLoginModal, setIsOpenLoginModal] = useState(false)
    const [typeLogin, setTypeLogin] = useState<'login' | 'registration' | 'reset_password'>('login')
    const [followShop] = useMutation(FOLLOW, {
        awaitRefetchQueries: true,
        refetchQueries: [{
            query: GET_USER_FOLLOWINGS,
            variables: {
                limit: 10,
                offset: 0,
                onlyIds: false
            }
        }],

    });
    const [unfollowShop] = useMutation(UNFOLLOW, {
        awaitRefetchQueries: true,
        refetchQueries: [{
            query: GET_USER_FOLLOWINGS,
            variables: {
                limit: 10,
                offset: 0,
                onlyIds: false
            }
        }],

    });
    const dispatch = useDispatch();
    const isShopFollower = () => {
        if (!user?.favouriteShops || !shopId) return false
        const result = user?.favouriteShops?.filter((element: string) => element === shopId)
        if (!result || result.length <= 0) return false
        return true
    }

    const addFollow = async () => {
        const resolve = await expirationTimeTokenControll(user.expirationTime)
        if (!resolve) return
        if (user.statusAuthentication === 'logged_out') {
            return setIsOpenLoginModal(true)
        }
        const isFollowed = isShopFollower();
        let favouriteShops = user.favouriteShops ? [...user.favouriteShops] : [];
        setOnFollowLoading(true)
        if (!shopId) return
        if (!isFollowed) {
            favouriteShops.push(shopId);
            dispatch(changeFavouriteShops({
                favouriteShops: favouriteShops
            }))

            try {
                await followShop({
                    variables: {
                        id: shopId
                    }
                })
                setOnFollowLoading(false)
            }
            catch {
                //TODO handle error follow
                setOnFollowLoading(false)

            }
        } else {

            dispatch(changeFavouriteShops({
                favouriteShops: favouriteShops?.filter((shopId: string) => shopId !== shopId)
            }))

            try {
                await unfollowShop({
                    variables: {
                        id: shopId
                    }
                })
                setOnFollowLoading(false)

            }
            catch {
                //TODO handle error follow
                setOnFollowLoading(false)

            }
        }
    }

    const closeModalHandler = useCallback(
        () => {
            setIsOpenLoginModal(false)
        }, []
    )

    return (
        <>
            <Button
                onClick={addFollow}
                variant={isShopFollower() ? 'grayPrimary' : 'primary'}
                borderRadius={'full'}
                //paddingInline={isShopFollower() ? [6, 6, 7, 7] : [10, 10, 12, 12]}
                width={[28, 28, 32, 32]}
                fontWeight={isShopFollower() ? 'semibold' : 'extrabold'}
                height={[9, 9, 12, 12]}
                fontSize={['md', 'md', 'lg', 'lg']}
                isDisabled={onFollowLoading}
                _disabled={{
                }}
                _hover={{
                }}
            >
                {isShopFollower() ? 'segui già' : 'segui'}
            </Button>
            <ModalReausable
                marginTop={0}
                title='' isOpen={isOpenLoginModal}
                closeModal={closeModalHandler}
            >
                <LoginAndRegistrationForm
                    open='modal'
                    type={typeLogin}
                    person='user'
                    handleChangeTypeOrPerson={(type, person) => {
                        if (person === 'business') return
                        setTypeLogin(type)
                    }}
                    closeModal={closeModalHandler}
                />
            </ModalReausable>
        </>

    )
}

export default ButtonFollow